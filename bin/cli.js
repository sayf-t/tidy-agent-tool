#!/usr/bin/env node
// The shebang line above tells the OS to run this with Node

import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { organize } from '../src/organizer.js';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    'dry-run': { type: 'boolean', short: 'd', default: false },
    'by-date': { type: 'boolean', default: false },
    help:      { type: 'boolean', short: 'h', default: false },
  },
});

if (values.help || positionals.length === 0) {
  console.log(`
Usage: tidydir <directory> [options]

Options:
  -d, --dry-run   Preview changes without moving files
      --by-date   Organize by modification date (YYYY-MM) instead of type
  -h, --help      Show this help
`);
  process.exit(0);
}

const targetDir = resolve(positionals[0]);

try {
  const results = await organize(targetDir, {
    dryRun: values['dry-run'],
    byDate: values['by-date'],
  });

  if (results.length === 0) {
    console.log('No files to organize.');
  } else {
    for (const r of results) {
      console.log(`  ${r.action}: ${r.file} → ${r.to}/`);
    }
    console.log(`\n${results.length} file(s) processed.`);
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}