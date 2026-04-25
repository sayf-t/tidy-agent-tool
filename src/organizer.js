import { readdir, mkdir, rename, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m"
};
// Map extensions to human-readable folder names
const CATEGORY_MAP = {
    '.jpg': 'images', '.jpeg': 'images', '.png': 'images', '.gif': 'images',
    '.svg': 'images', '.webp': 'images',
    '.mp4': 'videos', '.mkv': 'videos', '.avi': 'videos', '.mov': 'videos',
    '.mp3': 'audio', '.wav': 'audio', '.flac': 'audio', '.aac': 'audio',
    '.pdf': 'documents', '.doc': 'documents', '.docx': 'documents',
    '.txt': 'documents', '.md': 'documents', '.csv': 'documents',
    '.zip': 'archives', '.tar': 'archives', '.gz': 'archives', '.rar': 'archives',
    '.js': 'code', '.ts': 'code', '.py': 'code', '.c': 'code', '.cpp': 'code',
};

function categorize(filename) {
    const ext = extname(filename).toLowerCase();
    return CATEGORY_MAP[ext] || 'other';
}

export async function organize(targetDir, options = {}) {
    const { dryRun = false, byDate = false } = options;
    const entries = await readdir(targetDir);
    const results = [];

    for (const entry of entries) {
        const fullPath = join(targetDir, entry);
        const info = await stat(fullPath);

        // Skip directories - we only organize files
        if (info.isDirectory()) continue;

        let destFolder;
        if (byDate) {
            const date = info.mtime;
            destFolder = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else {
            destFolder = categorize(entry);
        }

        const destDir = join(targetDir, destFolder);
        const destPath = join(destDir, entry);

        if (dryRun) {
            const message = `${COLORS.yellow}[DRY RUN]${COLORS.reset} Would move ${COLORS.cyan}${entry}${COLORS.reset} → ${COLORS.gray}${destFolder}${COLORS.reset}`;
            console.log(message);
            results.push({ file: entry, to: destFolder, action: 'would move' });
          } else {
            await mkdir(destDir, { recursive: true });
            await rename(fullPath, destPath);
            const message = `${COLORS.green}[MOVED]${COLORS.reset} ${entry} → ${destFolder}`;
            console.log(message);
            results.push({ file: entry, to: destFolder, action: 'moved' });
          }
    }

    return results;
}
