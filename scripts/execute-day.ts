import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getData, getRealData, getTestData } from '@utils/data';
dotenv.config();

const ARGS = (() => {
  const i = process.argv.findIndex(arg => arg.endsWith('execute-day.ts'));
  const EXPECTED_COUNT = 3;
  const args = process.argv.slice(i + 1, i + 1 + EXPECTED_COUNT) as [string?, string?, string?];

  const givenDay = parseInt(args.find((arg) => {
    const day = parseInt(args[0], 10);
    return !isNaN(day);
  }), 10);

  const getToday = (): number => {
    const today = new Date();
    const isDecember = today.getMonth() === 11; // yes, 11 not 12, Jan is 0
    const date = today.getDate();
    if (!isDecember) {
      throw `Cannot infer today's date in setup except during December`;
    }
    return date;
  };

  const ptI = args.findIndex((arg) => arg.startsWith('pt') || arg.startsWith('part'));
  const part = args[ptI].replace(/[^\d]+/g, '');

  const testDataI = args.findIndex((arg) => arg.startsWith('-t') || arg.startsWith('--test-data'));
  const testDataSet = testDataI >= 0 ?
    args[testDataI].includes('=') ? parseInt(args[testDataI].split('=')[1], 10) : 0
  : -1;

  return {
    DAY: givenDay ? givenDay : getToday(),
    PART: part,
    TEST_DATA: testDataSet,
  };
})();

const BASE_DIR = path.resolve(__dirname, '..');
const DAY: number = ARGS.DAY;
const DAY_STRING = `${DAY < 10 ? '0' : ''}${DAY}`;
const DAY_DIR = path.resolve(BASE_DIR, `day-${DAY_STRING}`);
const PART = ARGS.PART;

if (isNaN(DAY)) {
  throw `Cannot run script 'setup-day' without DAY - invalid value ${DAY} provided`;
}

const main = async () => {
  console.log(`Executing day ${DAY}, part ${PART}`);
  const pathToFile = path.resolve(DAY_DIR, `part${PART}`);
  const part = require(pathToFile);
  const sharedFormat = require(path.resolve(DAY_DIR, 'format'));
  const format = part.format ? part.format : sharedFormat.format;
  const data = ARGS.TEST_DATA > -1 ? getTestData(DAY, ARGS.TEST_DATA) : getRealData(DAY);
  const answer = part.execute(...format(data));
  console.log('Answer: ');
  console.log(answer);
  fs.writeFileSync(path.resolve(DAY_DIR, `answer-part${PART}.txt`), `${answer}`, 'utf8');
  process.exit(0);
}

main();