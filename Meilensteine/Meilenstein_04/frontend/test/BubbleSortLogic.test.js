// import fs from 'fs';
// import path from 'path';
import {
  expect, describe, test, beforeEach, jest,
} from '@jest/globals';
import BubbleSort from '../src/BubbleSortLogic';

// const bubblesortHtml = fs.readFileSync
// (path.resolve(__dirname, '../src/BubbleSort.html'), 'utf8');
describe('BubbleSort', () => {
  describe('helper functions', () => {
    let mockStateChangeCallback = jest.fn();
    let bubble = new BubbleSort(jest.fn(), mockStateChangeCallback);

    beforeEach(() => {
      // Set up our document body
      // document.body.innerHTML = bubblesortHtml;
      mockStateChangeCallback = jest.fn();
      bubble = new BubbleSort(jest.fn(), mockStateChangeCallback);
    });

    // GenerateRandomNumbers() & showOutput() Test
    test.each([
      [0],
      [1],
      [42]])('generateRandomNumbers() & generate(%s)', (input) => {
      // input = länge des Arrays, das erstellt werden soll
      bubble.generateRandomNumbers(input);
      expect(bubble.exec.state.vars.arr.length).toBe(input);
      bubble.exec.state.vars.arr.forEach((element) => {
        expect(Number.isInteger(element)).toBeTruthy();
        expect(element).toBeGreaterThanOrEqual(0);
        expect(element).toBeLessThanOrEqual(50);
      });
      expect(mockStateChangeCallback.mock.calls[1][0].length).toEqual(input);
    });

    // editArray() & showOutput() Test
    test.each([
      [[1]],
      [[1, 2, 3, 4]],
      [[50, 10, 3, 20]]])('editArray()', (input) => {
      bubble.editArray(input);
      expect(bubble.exec.state.vars.arr).toBe(input);
      expect(mockStateChangeCallback.mock.calls[1][0]).toEqual(input);
    });
  });
});
