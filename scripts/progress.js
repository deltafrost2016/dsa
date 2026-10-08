// npm run progress -> runs every problem test file and prints solved / total per category.
// A problem is solved when its file has >= 1 test and every test passes.
// A file that fails to load (or has no tests) counts as unsolved. Always exits 0.
import { run } from 'node:test';
import os from 'node:os';
import path from 'node:path';
import { allSrcTestFiles, SRC, ROOT } from './_common.js';

const norm = (p) => path.resolve(p).toLowerCase();

async function main() {
  const files = allSrcTestFiles();
  /** @type {Map<string, {tests: number, failed: number}>} */
  const stats = new Map(files.map((f) => [norm(f), { tests: 0, failed: 0 }]));

  if (files.length > 0) {
    // Fallback leaf detection for Node versions whose events lack details.type:
    // an event is a suite if events nested deeper were reported just before it.
    const deeper = new Map(); // file -> counts per nesting level

    await new Promise((resolve) => {
      const stream = run({
        files,
        concurrency: Math.max(1, Math.min(8, (os.availableParallelism?.() ?? os.cpus().length) - 1)),
        timeout: 60000,
        signal: AbortSignal.timeout(Number(process.env.PROGRESS_TIMEOUT_MS) || 180000),
      });
      const onResult = (failed) => (data) => {
        const key = data.file ? norm(data.file) : null;
        const st = key && stats.get(key);
        if (!st) return;
        let isSuite;
        const type = data.details?.type;
        if (type) {
          isSuite = type === 'suite';
        } else {
          const counts = deeper.get(key) ?? [];
          deeper.set(key, counts);
          isSuite = (counts[data.nesting + 1] ?? 0) > 0;
          counts.length = data.nesting + 1;
          counts[data.nesting] = (counts[data.nesting] ?? 0) + 1;
        }
        if (isSuite) return;
        // File-level pseudo result: reported with the file path as its name when the
        // file fails to load (fail) or contains no tests (pass).
        if (data.nesting === 0 && norm(String(data.name)) === key) {
          if (failed) st.failed++;
          return;
        }
        st.tests++;
        if (failed) st.failed++;
      };
      stream.on('test:pass', onResult(false));
      stream.on('test:fail', onResult(true));
      stream.on('error', (e) => console.error(`runner error: ${e?.message ?? e}`));
      stream.on('end', resolve);
      stream.on('close', resolve);
      stream.resume(); // drain so the stream finishes
    });
  }

  /** @type {Map<string, {solved: number, total: number, unsolved: string[]}>} */
  const byCat = new Map();
  for (const f of files) {
    const cat = path.basename(path.dirname(f));
    const name = path.basename(f, '.test.js');
    const st = stats.get(norm(f));
    const solved = st.tests > 0 && st.failed === 0;
    const row = byCat.get(cat) ?? { solved: 0, total: 0, unsolved: [] };
    row.total++;
    if (solved) row.solved++;
    else row.unsolved.push(name);
    byCat.set(cat, row);
  }

  const cats = [...byCat.keys()].sort();
  const width = Math.max(8, ...cats.map((c) => c.length));
  console.log(`\n${'Category'.padEnd(width)}  Solved`);
  console.log(`${'-'.repeat(width)}  ------`);
  let solved = 0;
  let total = 0;
  for (const c of cats) {
    const r = byCat.get(c);
    solved += r.solved;
    total += r.total;
    console.log(`${c.padEnd(width)}  ${r.solved} / ${r.total}`);
  }
  console.log(`${'-'.repeat(width)}  ------`);
  console.log(`${'TOTAL'.padEnd(width)}  ${solved} / ${total}\n`);

  const pending = cats.filter((c) => byCat.get(c).unsolved.length);
  if (pending.length) {
    console.log('Unsolved:');
    for (const c of pending) console.log(`  ${c}\n    ${byCat.get(c).unsolved.join(', ')}`);
    console.log('');
  } else if (total > 0) {
    console.log('Everything solved!\n');
  } else {
    console.log(`No problem files found under ${path.relative(ROOT, SRC) || 'src'}.\n`);
  }
}

try {
  await main();
} catch (err) {
  console.error(`progress failed: ${err?.message ?? err}`);
}
process.exit(0);
