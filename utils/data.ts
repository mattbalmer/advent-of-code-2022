import * as fs from 'fs';
import * as path from 'path';

const getFilePath = (day: number, prefix: string, set?: number): string => {
  const filename = `${prefix}${set ? `-${set}` : ''}.txt`;
  const dirName = `day-${day < 10 ? `0${day}` : day}`
  return path.resolve(__dirname, '..', dirName, filename);
}

export const parseData = (content: string): string => {
  // return content.split('\n');
  return content;
}

export const getRealData = (day: number, set?: number): string => {
  const filename = getFilePath(day, 'data', set);
  const raw = fs.readFileSync(filename, 'utf8');
  return parseData(raw);
}

export const getTestData = (day: number, set?: number): string => {
  const filename = getFilePath(day, 'data-test', set);
  const raw = fs.readFileSync(filename, 'utf8');
  return parseData(raw);
}

type IGetData = {
  (day: number): {
    DATA?: string,
    TEST_DATA: string,
  }
  <T = string>(day: number, map: (line: string, i: number) => T): {
    DATA?: T,
    TEST_DATA: T,
  }
}
export const getData: IGetData = (day) => {
  let TEST_DATA = getTestData(day);
  if (fs.existsSync(getFilePath(day, 'data'))) {
    let DATA = getRealData(day);
    return {
      TEST_DATA,
      DATA
    }
  } else {
    return {
      TEST_DATA,
      DATA: null,
    }
  }
}

export const extractDay = (dirname: string): number => {
  return parseInt(dirname.split('/').slice(-1)[0].replace('day-', ''))
}

export const execute = <T = unknown, A extends any[] = unknown[]>(part: {
  format?: (input: string) => A,
  execute: (...args: A) => T,
}, data: string, format: (input: string) => A): ReturnType<typeof part.execute> => {
  if (part.format) {
    return part.execute(...part.format(data));
  }
  return part.execute(...format(data));
}

export const linesInFile = (string: string, options: {
  comments?: boolean
} = {}): string[] => {
  const lines = string.split('\n')
    .filter(line => options?.comments ? line.startsWith('#') : true);
  const isLastLineEmpty = !Boolean(lines[lines.length - 1]);

  if (isLastLineEmpty) {
    return lines.slice(0, -1);
  }

  return lines.slice(0);
}