import path from 'path';

export const PROJECT_DIR = path.resolve(__dirname, '..', '..');
const PATH_TO_PACKAGE_JSON = path.resolve(PROJECT_DIR, 'package.json');

export const YEAR = parseInt(require(PATH_TO_PACKAGE_JSON).year, 10);

export const getGivenDay = (args: string[]): number | typeof NaN => {
  return parseInt(args.find((arg) => {
    const day = parseInt(args[0], 10);
    return !isNaN(day);
  }), 10);
}

export const getToday = (): number => {
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

export const getDayOrToday = (args: string[]): number => {
  const givenDay = getGivenDay(args);
  return givenDay ? givenDay : getToday();
}