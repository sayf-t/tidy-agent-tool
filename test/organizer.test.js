import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { organize } from '../src/organizer.js';

describe('organize()', () => {
  let testDir;

  before(async () => {
    testDir = await mkdtemp(join(tmpdir(), 'tidydir-'));
    await writeFile(join(testDir, 'photo.jpg'), '');
    await writeFile(join(testDir, 'song.mp3'), '');
    await writeFile(join(testDir, 'readme.md'), '');
    await writeFile(join(testDir, 'mystery.xyz'), '');
  });

  after(async () => {
    await rm(testDir, { recursive: true });
  });

  it('should sort files into category folders', async () => {
    const results = await organize(testDir);
    assert.equal(results.length, 4);

    const categories = results.map(r => r.to);
    assert.ok(categories.includes('images'));
    assert.ok(categories.includes('audio'));
    assert.ok(categories.includes('documents'));
    assert.ok(categories.includes('other'));
  });

  it('dry run should not move files', async () => {
    // Reset: create a fresh dir for this test
    const dryDir = await mkdtemp(join(tmpdir(), 'tidydir-dry-'));
    await writeFile(join(dryDir, 'test.pdf'), '');

    const results = await organize(dryDir, { dryRun: true });
    assert.equal(results[0].action, 'would move');

    // File should still be in the root
    const remaining = await readdir(dryDir);
    assert.ok(remaining.includes('test.pdf'));

    await rm(dryDir, { recursive: true });
  });

  it('should sort files by date when byDate is true', async () => {
    // Create a specific file for this test
    const dateFile = 'dated-photo.jpg';
    await writeFile(join(testDir, dateFile), 'data');
    
    // Get the expected folder name based on current date (YYYY-MM)
    const now = new Date();
    const expectedFolder = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  
    const results = await organize(testDir, { byDate: true });
    
    // Find the result for our specific file
    const fileResult = results.find(r => r.file === dateFile);
    
    assert.strictEqual(fileResult.to, expectedFolder, `Expected folder to be ${expectedFolder}`);
    
    // Verify the folder actually exists on disk
    const items = await readdir(testDir);
    assert.ok(items.includes(expectedFolder), `Directory ${expectedFolder} should exist`);
  });
  
});