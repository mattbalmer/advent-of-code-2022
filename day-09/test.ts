import { it } from 'mocha';
import { expect } from 'chai';
import { execute, getData, getTestData } from '@utils/data';
import { format } from './format';
import * as part1 from './part1';
import * as part2 from './part2';

const { TEST_DATA, DATA } = getData(
  9
);

describe(`Day 9`, () => {
  describe('part 1', () => {
    it('should work on test case', () => {
      const expected = 13;
      const result = execute(part1, TEST_DATA, format);

      expect(result).to.equal(expected);
    });

    // it('should give the real answer', () => {
    //   const result = execute(part1, DATA, format);
    //
    //   console.log(result);
    // });
  });

  describe('part 2', () => {
    it('should work on small test case', () => {
      const expected = 1;
      const result = execute(part2, TEST_DATA, format);

      expect(result).to.equal(expected);
    });

    it('should work on larger test case', () => {
      const TEST_DATA_2 = getTestData(9, 2);
      const expected = 36;
      const result = execute(part2, TEST_DATA_2, format);

      expect(result).to.equal(expected);
    });

    // it('should give the real answer', () => {
    //   const result = execute(part2, DATA, format);
    //
    //   console.log(result);
    // });
  });
});