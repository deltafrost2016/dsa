// Shared helpers for the runner scripts (not meant to be run directly).
import { readdirSync, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SRC = path.join(ROOT, 'src');
export const LIB = path.join(ROOT, 'lib');

/** @returns {string[]} category folder names under src/, sorted. */
export function listCategories() {
  if (!existsSync(SRC)) return [];
  return readdirSync(SRC, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/**
 * @param {string} dir absolute directory
 * @returns {string[]} absolute paths of *.test.js directly inside dir, sorted
 */
export function testFilesIn(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith('.test.js'))
    .sort()
    .map((f) => path.join(dir, f));
}

/** @returns {string[]} every src/<category>/*.test.js, absolute, sorted. */
export function allSrcTestFiles() {
  return listCategories().flatMap((c) => testFilesIn(path.join(SRC, c)));
}

/**
 * Run `node [--watch] --test <files>` and resolve with its exit code.
 * Refuses to run with no files (node --test with no files would scan the whole cwd).
 * @param {string[]} files
 * @param {{watch?: boolean}} [opts]
 * @returns {Promise<number>}
 */
export function runNodeTest(files, { watch = false } = {}) {
  if (files.length === 0) {
    console.log('No test files found.');
    return Promise.resolve(0);
  }
  const args = [...(watch ? ['--watch'] : []), '--test', ...files];
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { stdio: 'inherit', cwd: ROOT });
    child.on('error', (err) => {
      console.error(err.message);
      resolve(1);
    });
    child.on('exit', (code, signal) => resolve(code ?? (signal ? 1 : 0)));
  });
}
