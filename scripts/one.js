// npm run one -- trapping-rain-water          (with or without .test.js)
// npm run watch -- trapping-rain-water        (re-runs on file changes)
import path from 'node:path';
import { listCategories, testFilesIn, SRC, runNodeTest } from './_common.js';

const args = process.argv.slice(2);
const watch = args.includes('--watch');
const raw = args.find((a) => !a.startsWith('--'));
if (!raw) {
  console.error('Usage: npm run one -- <problem-name>   e.g. npm run one -- trapping-rain-water');
  process.exit(1);
}
const base = path.basename(raw).replace(/\.test\.js$/, '').replace(/\.js$/, '');
const all = listCategories().flatMap((c) => testFilesIn(path.join(SRC, c)));
const exact = all.filter((f) => path.basename(f) === `${base}.test.js`);

if (exact.length === 0) {
  const near = all
    .map((f) => path.basename(f, '.test.js'))
    .filter((n) => n.includes(base) || base.includes(n))
    .slice(0, 10);
  console.error(`No test file named "${base}.test.js" under src/*/.`);
  if (near.length) console.error(`Did you mean:\n${near.map((n) => `  ${n}`).join('\n')}`);
  process.exit(1);
}
process.exitCode = await runNodeTest(exact, { watch });
