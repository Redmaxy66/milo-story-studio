"""Small SQLite job/attempt ledger for the external runner. No provider calls.
Single local service owns this database; never use an n8n execution log as a spend lock.
"""
import sqlite3,json,hashlib
class Store:
 def __init__(self,path):
  self.db=sqlite3.connect(path,timeout=15,isolation_level=None)
  self.db.execute('PRAGMA journal_mode=WAL')
  self.db.executescript('CREATE TABLE IF NOT EXISTS jobs (id TEXT PRIMARY KEY, revision INTEGER NOT NULL, data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS attempts (id TEXT PRIMARY KEY, pilot TEXT NOT NULL, status TEXT NOT NULL, maximum REAL NOT NULL, actual REAL, data TEXT NOT NULL);')
 def save_job(self,id,data,expected_revision):
  self.db.execute('BEGIN IMMEDIATE')
  try:
   row=self.db.execute('SELECT revision FROM jobs WHERE id=?',(id,)).fetchone();revision=row[0] if row else 0
   if revision!=expected_revision:raise ValueError('STALE_JOB_REVISION')
   self.db.execute('INSERT INTO jobs VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET revision=excluded.revision,data=excluded.data',(id,revision+1,json.dumps(data)))
   self.db.execute('COMMIT');return revision+1
  except: self.db.execute('ROLLBACK');raise
 def reserve(self,attempt,pilot,cap,max_attempts):
  # This build only exercises isolated reservations; unlocking real spend needs a versioned pilot change.
  if attempt.get('environment')!='isolated_test':raise ValueError('PAID_PILOT_APPROVAL_REQUIRED')
  self.db.execute('BEGIN IMMEDIATE')
  try:
   rows=self.db.execute('SELECT status,maximum,actual FROM attempts WHERE pilot=?',(pilot,)).fetchall()
   if any(r[0] not in ('FAILED_NO_GENERATION','REVIEWED') for r in rows):raise ValueError('PRIOR_ATTEMPT_UNRESOLVED')
   if len(rows)>=max_attempts:raise ValueError('ATTEMPT_LIMIT')
   if any(r[2] is None or r[2]<0 for r in rows):raise ValueError('UNRECONCILED_COST')
   maximum=attempt['maximum_credits']
   if maximum<=0 or sum(r[2] for r in rows)+maximum>cap:raise ValueError('BUDGET_EXCEEDED')
   self.db.execute('INSERT INTO attempts VALUES(?,?,?,?,?,?)',(attempt['request_id'],pilot,'RESERVED',maximum,None,json.dumps(attempt)))
   self.db.execute('COMMIT')
  except:self.db.execute('ROLLBACK');raise
 def reconcile(self,request_id,result):
  if result['status'] not in ('RUNNING','RECONCILIATION_REQUIRED','COMPLETED_NEEDS_RETRIEVAL','FAILED_NO_GENERATION','REVIEWED'):raise ValueError('INVALID_STATUS')
  if result.get('actual_credits') is not None and result['actual_credits']<0:raise ValueError('INVALID_COST')
  if result['status'] in ('REVIEWED','FAILED_NO_GENERATION') and result.get('actual_credits') is None:raise ValueError('ACTUAL_COST_REQUIRED')
  row=self.db.execute('UPDATE attempts SET status=?,actual=?,data=? WHERE id=?',(result['status'],result.get('actual_credits'),json.dumps(result),request_id))
  if row.rowcount!=1:raise ValueError('ATTEMPT_NOT_FOUND')
