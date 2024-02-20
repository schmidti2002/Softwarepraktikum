import {
    expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import SingletonManager from '../src/SingletonManager';
import { awaitAllAsync, delay, mockFetchHtml, mockReload } from './testUtils.test.js';
import InputView from '../src/InputView';

describe('InputView.js', () => {
    const callback = jest.fn();
    const singletonManager = new SingletonManager();

    beforeAll(() => {
        singletonManager.registerConstructor('EventReporter', () => ({
          info: infoFnMock,
          warn: warnFnMock,
          error: errorFnMock,
        }));

        mockFetchHtml('../src/InputView.html');
    });

    beforeEach(() => {
        callback.mockClear();
    });

    test.each([
        ["0",{value: 0}],
        ["1",{value: 1}],
        ["-1",{value: -1}],
        ["1024",{value: 1024}],
        ["-1024",{value: -1024}],
        ["&0",{error: 'Darf nur eine Ganzzahl sein'}],
        ["1.5",{error: 'Darf nur eine Ganzzahl sein'}],
        ["+2,7",{error: 'Darf nur eine Ganzzahl sein'}],
        ["8hp!",{error: 'Darf nur eine Ganzzahl sein'}],
        ["Fünf",{error: 'Darf nur eine Ganzzahl sein'}]
    ])('parseInt()', async (input, solution) => {
        expect(InputView.parseInt(input)).toStrictEqual(solution);
    });

});