import fs from 'fs';
import path from 'path';
import {
  expect, describe, test, beforeEach,
} from '@jest/globals';
import BubbleSort from '../src/BubbleSortLogic';

const bubblesortHtml = fs.readFileSync(path.resolve(__dirname, '../src/BubbleSort.html'), 'utf8');

describe('BubbleSort', () => {
  describe('helper functions', () => {
    // "Dumme" Nutzereingaben
    let bubble;
    let mockStateChangeCallback;
    beforeEach(() => {
      // Set up our document body
      document.body.innerHTML = bubblesortHtml;
      mockStateChangeCallback = jest.fn();
      bubble = new BubbleSort();
    });

    // GenerateRandomNumbers() Test
    test.each([
      [0, 0],
      [-1, 0],
      [0.5, 0],
      ['einString', 0],
      ['a', 0],
      ['42', 0],
      [10000, 0],
      [Number.MIN_SAFE_INTEGER, 0],
      [true, 0],
      [false, 0],
      [1, 1],
      [42, 42],
      ['1,2,3,4,5', 0],
      ['a,b,c', 0],
      ['1,b,3,d', 0]])('generateRandomNumbers() & generate(%s)', (input, solution) => {
      // solution = länge des Arrays, das erstellt werden soll
      // Ich habe einfach mal 0 für falsche eingaben Festgelegt
      bubble.generateRandomNumbers(input);
      expect(bubble.exec.state.vars.arr.length).toBe(solution);
      bubble.exec.state.vars.arr.forEach((element) => {
        expect(Number.isInteger(element)).toBeTruthy();
        expect(element).toBeGreaterThanOrEqual(0);
      });
    });

    // editArray() Test
    test.each([
      [[1], [1]],
      [[true], []],
      [false, []],
      [[1.2, 7.4], []],
      [[1, 2, 3, 4.5], []],
      [[1, 2, 3, 4], [1, 2, 3, 4]],
      [10, []],
      [[1], [1]],
      [[42, 1000], []],
      [[50, 10, 3, 20], [50, 10, 3, 20]],
      [['string', 'noch einer'], []],
      [[-1], []]])('editArray()', (input, solution) => {
      bubble.editArray(input);
      expect(bubble.exec.state.vars.arr).toBe(solution);
      bubble.exec.state.vars.arr.forEach((element) => {
        expect(Number.isInteger(element)).toBeTruthy();
        expect(element).toBeGreaterThanOrEqual(0);
      });
    });

    // showOutput() Test
    test('showOutput calls stateChangeCallback with correct parameters', () => {
      // Setze den Zustand des BubbleSort-Objekts
      bubble.exec.state.vars.arr = [1, 2, 3];
      bubble.exec.state.vars.currentLine = 5;
      bubble.exec.state.running = true;
      // Rufe die showOutput Methode auf
      bubble.showOutput();
      // Überprüfe, ob der Callback mit den richtigen Parametern aufgerufen wurde
      expect(mockStateChangeCallback).toHaveBeenCalledWith(
        [1, 2, 3], // Erwartetes Array
        bubble.exec.state.vars, // Erwartete Variablen
        5, // Erwartete aktuelle Zeile
        true, // Erwarteter Laufzustand
      );
    });
  });
});
