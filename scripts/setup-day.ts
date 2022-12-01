import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();

const YEAR = 2022;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARGS = (() => {
  const i = process.argv.findIndex(arg => arg.endsWith('setup-day.ts'));
  const EXPECTED_COUNT = 3;
  const args = process.argv.slice(i + 1, i + 1 + EXPECTED_COUNT) as [string, string?, string?];

  const givenDay = parseInt(args.find((arg) => {
    const day = parseInt(args[0], 10);
    return !isNaN(day);
  }), 10);

  const getToday = (): number => {
    const today = new Date();
    const isDecember = today.getMonth() === 11; // yes, 11 not 12, Jan is 0
    const isCorrectYear = today.getFullYear() === YEAR;
    const date = today.getDate();
    if (!isCorrectYear) {
      throw `Cannot infer today's date in setup for invalid year ${today.getFullYear()}`;
    }
    if (!isDecember) {
      throw `Cannot infer today's date in setup except during December`;
    }
    return date;
  };

  return {
    DAY: givenDay ? givenDay : getToday(),
    FORCE: args.some((arg) => arg === '--force'),
    SKIP_FETCH: args.some((arg) => arg === '--skip-fetch'),
  };
})();

const BASE_DIR = path.resolve(__dirname, '..');
const DAY: number = ARGS.DAY;
const SESSION_TOKEN = process.env.WEB_SESSION;
const DAY_STRING = `${DAY < 10 ? '0' : ''}${DAY}`;
const DAY_DIR = path.resolve(BASE_DIR, `day-${DAY_STRING}`);
const TEMPLATE_DIR = path.resolve(BASE_DIR, `day-template`);
const FORCE = ARGS.FORCE;

if (isNaN(DAY)) {
  throw `Cannot run script 'setup-day' without DAY - invalid value ${DAY} provided`;
}

const getUrlForInput = (day) => `https://adventofcode.com/${YEAR}/day/${day}/input`;

const downloadInput = async (): Promise<string> => {
  const res = await fetch(getUrlForInput(DAY), {
    headers: {
      'Cookie': `session=${SESSION_TOKEN}`,
    },
  });
  return await res.text();
}

const setupDir = async () => {
  const doesDirExist = fs.existsSync(DAY_DIR);
  if (!doesDirExist) {
    fs.mkdirSync(DAY_DIR);
    console.log(`dir ./day-${DAY_STRING} created`);
  }

  const FILES_TO_COPY = [
    'data.txt',
    'data-test.txt',
    'part1.ts',
    'part2.ts',
    'format.ts',
    'test.ts',
  ];

  const copyFile = (filename: string): boolean => {
    const doesExist = fs.existsSync(path.resolve(DAY_DIR, filename));
    if (!doesExist || FORCE) {
      fs.copyFileSync(
        path.resolve(TEMPLATE_DIR, filename),
        path.resolve(DAY_DIR, filename),
      );
      console.log(`${doesExist ? 'Replaced' : 'Created'} file ${filename}`);
      return true;
    }
    return false;
  }

  for (const filename of FILES_TO_COPY) {
    if (filename === 'data.txt' && ARGS.SKIP_FETCH) {
      console.log(`-- skipping data fetch`);
      continue;
    }

    const wasCopied = copyFile(filename);
    const pathTo = path.resolve(DAY_DIR, filename);

    if (filename === 'data.txt' && wasCopied) {
      const data = await downloadInput();
      fs.writeFileSync(pathTo, data, 'utf8');
    }

    if (filename === 'test.ts' && wasCopied) {
      const raw = fs.readFileSync(pathTo, 'utf8');
      const replaced = raw
        .replaceAll('{DAY}', `${DAY}`)
        .replaceAll('\n  // @ts-ignore DELETE_ME', '');
      fs.writeFileSync(pathTo, replaced, 'utf8');
    }
  }
}

console.log(`Setting up Day ${DAY}${FORCE ? ', with FORCE enabled' : ''}`);
await setupDir();
console.log(`Setup complete`);
process.exit(0);