import {
  beforeEach, describe, test, jest, expect,
} from '@jest/globals';
import * as _ from 'lodash';
import Logic from '../src/Logic';
import { arrayEveryEntry, minMax, notEmpty } from '../src/inputValidators';

// Create the mock functions outside of the mock factory
const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockStep = jest.fn();
const mockNextBreak = jest.fn();
const mockReset = jest.fn();
const mockChangeAlgo = jest.fn();
const mockFatal = jest.fn();

// Mock the module with a factory function that returns the mock methods
jest.mock('../src/AlgoExecuter', () => ({
  Executer: jest.fn().mockImplementation(() => ({
    play: mockPlay,
    pause: mockPause,
    step: mockStep,
    next: mockNextBreak,
    reset: mockReset,
    changeAlgo: mockChangeAlgo,
  })),
}));
describe('Logic.test.js', () => {
  let logic;

  beforeEach(() => {
    // Clear all mocks before each test
    mockPlay.mockClear();
    mockPause.mockClear();
    mockStep.mockClear();
    mockNextBreak.mockClear();
    mockReset.mockClear();
    mockChangeAlgo.mockClear();
    mockFatal.mockClear();

    // Create a new instance of Logic before each test
    const eventReporter = ({
      fatal: mockFatal,
    });
    logic = new Logic(eventReporter);
  });

  test('play should call the play method from the executer', () => {
    logic.play();
    expect(mockPlay).toHaveBeenCalled();
  });

  test('pause should call the pause method from the executer', () => {
    logic.pause();
    expect(mockPause).toHaveBeenCalled();
  });

  test('step should call the step method from the executer', () => {
    logic.step();
    expect(mockStep).toHaveBeenCalled();
  });

  test('nextBreak should call the nextBreak method from the executer', () => {
    logic.nextBreak();
    expect(mockNextBreak).toHaveBeenCalled();
  });

  test('reset should call the reset method from the executer', () => {
    logic.reset();
    expect(mockReset).toHaveBeenCalled();
  });

  test('loadAlgoByIndex should load an Algo when the index points at a part of the algo', () => {
    logic.algos = [{
      algo: {
        breakpoints: 42,
        lines: 42,
      },
    }];
    logic.loadAlgoByIndex(0, 42);
    expect(mockChangeAlgo).toHaveBeenCalled();
  });

  test('loadAlgoByIndex should not load an Algo when the index is too big', () => {
    logic.algos = [
      {
        algo: {
          breakpoints: 42,
          lines: 42,
        },
      },
      {
        notAlgo: 42,
      }];
    logic.loadAlgoByIndex(1, 42);
    expect(mockFatal).toHaveBeenCalled();
  });
});
