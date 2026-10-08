// npm test        -> every src/**/*.test.js
// npm run test:lib -> lib/*.test.js (pass --lib)
import { allSrcTestFiles, testFilesIn, LIB, runNodeTest } from './_common.js';

const files = process.argv.includes('--lib') ? testFilesIn(LIB) : allSrcTestFiles();
process.exitCode = await runNodeTest(files);
