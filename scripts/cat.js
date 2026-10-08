// npm run cat -- 04-stack      (also accepts a unique partial name like "stack")
import path from 'node:path';
import { listCategories, testFilesIn, SRC, runNodeTest } from './_common.js';

const arg = process.argv[2];
const cats = listCategories();
const list = cats.map((c) => `  ${c}`).join('\n');

if (!arg) {
  console.error(`Usage: npm run cat -- <category>\n\nCategories:\n${list}`);
  process.exit(1);
}
let name = cats.find((c) => c === arg);
if (!name) {
  const partial = cats.filter((c) => c.includes(arg));
  if (partial.length === 1) name = partial[0];
}
if (!name) {
  console.error(`Unknown category "${arg}".\n\nCategories:\n${list}`);
  process.exit(1);
}
const files = testFilesIn(path.join(SRC, name));
if (files.length === 0) {
  console.log(`No tests in ${name} yet.`);
  process.exit(0);
}
process.exitCode = await runNodeTest(files);
