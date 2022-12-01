import { Execute } from './format';

export const execute: Execute = (lines) => {
  return lines.reduce((sum, line) => sum + line, 0);
}