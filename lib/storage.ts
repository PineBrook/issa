import 'server-only';

import { mkdir, readFile, unlink, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

function getStorageBaseDir(): string {
  if (process.env.RESUME_STORAGE_DIR) {
    return path.resolve(process.env.RESUME_STORAGE_DIR);
  }
  return path.join(process.cwd(), '.private_storage', 'resumes');
}

function resolveSecurePath(storageKey: string): string {
  const baseDir = getStorageBaseDir();
  // Normalize and prevent path traversal
  const cleanKey = storageKey.replace(/^[/\\]+/, '').replace(/\.\.[/\\]/g, '');
  const targetPath = path.join(/*turbopackIgnore: true*/ baseDir, cleanKey);

  if (!targetPath.startsWith(baseDir)) {
    throw new Error('Access denied: Invalid storage key path.');
  }

  return targetPath;
}

export async function saveResumeFile(
  storageKey: string,
  data: Buffer,
  _contentType?: string
): Promise<void> {
  const targetPath = resolveSecurePath(storageKey);
  const parentDir = path.dirname(targetPath);

  await mkdir(parentDir, { recursive: true });
  await writeFile(targetPath, data);
}

export async function getResumeFile(
  storageKey: string
): Promise<{ buffer: Buffer } | null> {
  try {
    const targetPath = resolveSecurePath(storageKey);
    const buffer = await readFile(/*turbopackIgnore: true*/ targetPath);
    return { buffer };
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException;
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTDIR')) {
      return null;
    }
    throw err;
  }
}

export async function deleteResumeFile(storageKey: string): Promise<void> {
  try {
    const targetPath = resolveSecurePath(storageKey);
    await unlink(/*turbopackIgnore: true*/ targetPath);
  } catch (err: unknown) {
    const error = err as NodeJS.ErrnoException;
    if (error && error.code === 'ENOENT') {
      // Already deleted or never created
      return;
    }
    throw err;
  }
}

export async function resumeFileExists(storageKey: string): Promise<boolean> {
  try {
    const targetPath = resolveSecurePath(storageKey);
    const s = await stat(/*turbopackIgnore: true*/ targetPath);
    return s.isFile();
  } catch {
    return false;
  }
}
