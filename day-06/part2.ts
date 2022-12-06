import { Execute } from './format';
import { findIndexOfUniqueWindow } from './shared';

const TRIGGER_LEN = 14;

export const execute: Execute = (line) =>
  findIndexOfUniqueWindow(line, TRIGGER_LEN)