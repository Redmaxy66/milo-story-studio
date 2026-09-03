#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = ['validate_m8_contracts.mjs','validate_m8_lifecycle.mjs','validate_m8_hashing.mjs','validate_m8_openart_adapter.mjs','validate_m8_story_vault_schema.mjs','validate_m8_workflow_skeletons.mjs'];
let passed = 0;
for (const script of scripts) {
  const result = spawnSync(process.execPath, [path.join(root, '06-testing', script)], {cwd:root, encoding:'utf8', env:{PATH:process.env.PATH}});
  if (result.status !== 0) {
    process.stderr.write(result.stdout); process.stderr.write(result.stderr);
    throw new Error(`${script} failed`);
  }
  process.stdout.write(result.stdout);
  passed += 1;
}
const modules = ['contracts.mjs','canonical-json.mjs','hashing.mjs','openart-adapter-interface.mjs'].map(name => fs.readFileSync(path.join(root,'05-code/m8',name),'utf8')).join('\n');
assert(!/\bfetch\s*\(|https?:\/\/api\.|axios|XMLHttpRequest|WebSocket/.test(modules), 'network implementation found in M8 code');
passed += 1;
assert(!fs.existsSync(path.join(root,'MILO_M8_DESIGN_APPROVAL_PACKAGE.md')), 'external design artifact must not be in repository');
passed += 1;
const vault = fs.readFileSync(path.join(root,'02-story-system/M8_STORY_VAULT_SCHEMA.md'),'utf8');
assert(!/^\d+\. `M8Errors`$/m.test(vault), 'M8Errors proposed as a tab');
assert(vault.includes('`StudioControl` is not a contract or operational source of truth'));
passed += 1;

console.log(`M8 PHASE 2 AGGREGATE: PASS (${passed}/${passed})`);
