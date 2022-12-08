import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getRealData, getTestData } from '@utils/data';
import { getDayOrToday, PROJECT_DIR } from './utils/misc';
dotenv.config();

const ARGS = (() => {
  const i = process.argv.findIndex(arg => arg.endsWith('execute-day.ts'));
  const EXPECTED_COUNT = 3;
  const args = process.argv.slice(i + 1, i + 1 + EXPECTED_COUNT) as [string?, string?, string?];

  const ptI = args.findIndex((arg) => arg.startsWith('pt') || arg.startsWith('part'));
  if(ptI < 0) {
    throw `A part arg is required, please supply 'pt1' or 'pt2'`
  }
  const part = args[ptI].replace(/[^\d]+/g, '');

  const testDataI = args.findIndex((arg) => arg.startsWith('-t') || arg.startsWith('--test-data'));
  const testDataSet = testDataI >= 0 ?
    args[testDataI].includes('=') ? parseInt(args[testDataI].split('=')[1], 10) : 0
  : -1;

  return {
    DAY: getDayOrToday(args),
    PART: part,
    TEST_DATA: testDataSet,
  };
})();

const DAY: number = ARGS.DAY;
const DAY_STRING = `${DAY < 10 ? '0' : ''}${DAY}`;
const DAY_DIR = path.resolve(PROJECT_DIR, `day-${DAY_STRING}`);
const PART = ARGS.PART;

if (isNaN(DAY)) {
  throw `Cannot run script 'setup-day' without DAY - invalid value ${DAY} provided`;
}

const main = async () => {
  const startedAt = Date.now();
  console.log(`Executing day ${DAY}, part ${PART}`);
  const pathToFile = path.resolve(DAY_DIR, `part${PART}`);
  const part = require(pathToFile);
  const sharedFormat = require(path.resolve(DAY_DIR, 'format'));
  const format = part.format ? part.format : sharedFormat.format;
  const data = ARGS.TEST_DATA > -1 ? getTestData(DAY, ARGS.TEST_DATA) : getRealData(DAY);
  const answer = part.execute(...format(data));
  const finishedAt = Date.now();
  const duration = finishedAt - startedAt;
  console.log(`\nAnswer: (${duration}ms)`);
  console.log(` ${answer}\n`);
  const fileContents =
`${answer}
-----
duration: ${duration}ms
`;
  // console.log(fileContents);
  fs.writeFileSync(path.resolve(DAY_DIR, `answer-part${PART}.txt`), fileContents, 'utf8');
  process.exit(0);
}

main();