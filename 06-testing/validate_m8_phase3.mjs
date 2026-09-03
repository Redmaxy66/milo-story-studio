#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {contentHash} from '../05-code/m8/hashing.mjs';
import {validateMinimalFixture, rejectInvalidFixtureCase, validatePhase3Repository} from '../05-code/m8/phase3-validation.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtures = path.join(root, '06-testing/fixtures/m8/phase3');
const valid = JSON.parse(fs.readFileSync(path.join(fixtures, 'valid-minimal-phase3-package.json'), 'utf8'));
assert.equal(valid.scenes[0].sourceTextHash, contentHash(valid.scenes[0].sourceText));
validateMinimalFixture(valid);
const invalid = JSON.parse(fs.readFileSync(path.join(fixtures, 'invalid-phase3-cases.json'), 'utf8'));
for (const testCase of invalid) rejectInvalidFixtureCase(valid, testCase);
const result = validatePhase3Repository(root);
const total = result.passed + 1 + invalid.length;
console.log(`M8 PHASE 3 VALIDATION: PASS (${total}/${total})`);
