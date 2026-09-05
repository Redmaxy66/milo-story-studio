import sys,tempfile,pathlib
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'05-code/streamlined'))
from job_store import Store
with tempfile.TemporaryDirectory() as tmp:
 a=Store(tmp+'/jobs.db');b=Store(tmp+'/jobs.db')
 assert a.save_job('week',{'test':True},0)==1
 try:b.save_job('week',{},0);raise AssertionError('stale write accepted')
 except ValueError as e:assert str(e)=='STALE_JOB_REVISION'
 attempt={'request_id':'one','environment':'isolated_test','maximum_credits':250}
 a.reserve(attempt,'pilot',750,3)
 try:b.reserve({**attempt,'request_id':'two'},'pilot',750,3);raise AssertionError('concurrent spend accepted')
 except ValueError as e:assert str(e)=='PRIOR_ATTEMPT_UNRESOLVED'
 a.reconcile('one',{'status':'REVIEWED','actual_credits':250})
 try:b.reserve({**attempt,'request_id':'two'},'pilot',499,3);raise AssertionError('cap exceeded')
 except ValueError as e:assert str(e)=='BUDGET_EXCEEDED'
 try:b.reserve({**attempt,'environment':'production'},'pilot',750,3);raise AssertionError('paid gate bypassed')
 except ValueError as e:assert str(e)=='PAID_PILOT_APPROVAL_REQUIRED'
 print('PASS SQLite stale writes, competing connections, real cost reservation and production lock')
