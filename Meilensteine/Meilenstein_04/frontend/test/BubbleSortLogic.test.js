import {
  expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import { Executer } from '../src/AlgoExecuter';
import BubbleSort from '../src/BubbleSortLogic';

// const bubblesortHtml = fs.readFileSync
// (path.resolve(__dirname, '../src/BubbleSort.html'), 'utf8');
describe('BubbleSort', () => {
  describe('helper functions', () => {
    let mockStateChangeCallback = jest.fn();
    let bubble = new BubbleSort({}, mockStateChangeCallback);

    beforeEach(() => {
      // Set up our document body
      // document.body.innerHTML = bubblesortHtml;
      mockStateChangeCallback = jest.fn();
      bubble = new BubbleSort({}, mockStateChangeCallback);
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

    // Dies ist jetzt vielleicht kein Unit-Test mehr
    test.each([
      [[1], [1]],
      [[2,1], [1,2]],
      [[2,3,1], [1,2,3]],
      [[4,3,2,1], [1,2,3,4]],
      [[50, 35, 40, 15, 30, 45, 5, 20, 25, 10], [5,10,15,20,25,30,35,40,45,50]],
      [[4,3,2,1,0,4,3,2,1,0], [0,0,1,1,2,2,3,3,4,4]],
      [[4,3,2,1,4,3,2,4,3,4], [1,2,2,3,3,3,4,4,4,4]],
      [[1000000,100000,10000,1000,100,10,1], [1,10,100,1000,10000,100000,1000000]],
      ])('sort', (array, solution) => {
        bubble.exec = new Executer({});
        bubble.exec.changeAlgo(bubble.linesForBubbleSort, [], 0, {arr: array})
          for(let i = 0; i < 1000; i++){
            bubble.nextBreak()
          }
          expect(bubble.exec.state.vars.arr).toStrictEqual(solution);
      });
  });
});
