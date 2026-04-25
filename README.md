# tidy-agent-tool

A small command-line tool that moves loose files in a folder into subfolders. Default mode groups by file type (images, videos, documents, and so on). Optional mode groups by last modified month.

## Who this is for

- **Agents:** You get a single command, `tidydir`, that takes a directory path and optional flags. It only affects **files** in that directory (not nested folders). Use `--dry-run` first if the user should preview moves.
- **Developers:** Node.js project (ES modules). Core logic lives in `src/organizer.js`; the CLI wrapper is `bin/cli.js`.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer (uses built-in `node:util` `parseArgs` and `node:test`).

## Install and run

From this repo:

```bash
npm install -g .
```

Then:

```bash
tidydir /path/to/folder
```

Or without installing globally:

```bash
node bin/cli.js /path/to/folder
```

## Options

| Flag | Meaning |
|------|---------|
| `-d`, `--dry-run` | Show what would happen; do not move files |
| `--by-date` | Put files in folders named `YYYY-MM` from each file’s modification time |
| `-h`, `--help` | Print usage |

If you run `tidydir` with no path, or with `--help`, it prints help and exits.

## Behavior (short)

- **By type (default):** Known extensions go to folders like `images`, `videos`, `audio`, `documents`, `archives`, `code`. Anything else goes to `other`.
- **By date (`--by-date`):** Each file goes under a folder like `2026-04` based on `mtime`.
- Subfolders in the target directory are left as-is; only **files** in the top level of the target are moved.

## Development

| Task | Command |
|------|---------|
| Run tests | `node --test` |
| CLI entry | `bin/cli.js` → binary name `tidydir` (see `package.json` → `bin`) |
