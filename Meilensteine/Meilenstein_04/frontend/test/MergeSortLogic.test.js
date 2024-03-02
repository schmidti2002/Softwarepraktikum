// import fs from 'fs';
// import path from 'path';
import {
    expect, describe, test, beforeEach, jest,
  } from '@jest/globals';
  import MergeSort from '../src/MergeSortLogic';
  
  // const bubblesortHtml = fs.readFileSync
  // (path.resolve(__dirname, '../src/BubbleSort.html'), 'utf8');
  describe('MergeSort', () => {
    describe('helper functions', () => {
      let mockStateChangeCallback = jest.fn();
      let merge = new MergeSort({}, mockStateChangeCallback);
  
      beforeEach(() => {
        // Set up our document body
        // document.body.innerHTML = bubblesortHtml;
        mockStateChangeCallback = jest.fn();
        merge = new MergeSort({}, mockStateChangeCallback);
      });
  
      // GenerateRandomNumbers() & showOutput() Test
      test.each([
        [0],
        [1],
        [42]])('generateRandomNumbers() & generate(%s)', (input) => {
        // input = länge des Arrays, das erstellt werden soll
        merge.generateRandomNumbers(input);
        expect(merge.exec.state.vars.arr.length).toBe(input);
        merge.exec.state.vars.arr.forEach((element) => {
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
        merge.editArray(input);
        expect(merge.exec.state.vars.arr).toBe(input);
        expect(mockStateChangeCallback.mock.calls[1][0]).toEqual(input);
      });
    });
  });
  