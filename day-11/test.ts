import { it } from 'mocha';
import { expect } from 'chai';
import { execute, getData } from '@utils/data';
import { format } from './format';
import * as part1 from './part1';
// import * as part2 from './part2';

const { TEST_DATA, DATA } = getData(
  11
);

describe(`Day 11`, () => {
  describe('part 1', () => {
    it('should work on test case', () => {
      const expected = 10605;
      const result = execute(part1, TEST_DATA, format);

      expect(result).to.equal(expected);
    });

    // it('should give the real answer', () => {
    //   const result = execute(part1, DATA, format);
    //
    //   console.log(result);
    // });
  });

  // describe('part 2', () => {
  //   it('should work on test case', () => {
  //     const expected = 0;
  //     const result = execute(part2, TEST_DATA, format);
  //
  //     expect(result).to.equal(expected);
  //   });
  //
  //   // it('should give the real answer', () => {
  //   //   const result = execute(part2, DATA, format);
  //   //
  //   //   console.log(result);
  //   // });
  // });
});