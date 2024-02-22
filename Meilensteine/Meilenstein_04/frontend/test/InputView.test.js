import {
    expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import SingletonManager from '../src/SingletonManager';
import { awaitAllAsync, delay, mockFetchHtml, mockReload } from './testUtils.test.js';
import InputView from '../src/InputView';
import { arrayEveryEntry, minMax, notEmpty } from '../src/inputValidators'
import * as _ from 'lodash';
import { initial } from 'lodash';

describe('InputView.js', () => {
    const callback = jest.fn();
    const fatalFnMock = jest.fn();
    const singletonManager = new SingletonManager();

    beforeAll(() => {
        singletonManager.registerConstructor('EventReporter', () => ({
            fatal: fatalFnMock,
        }));

        mockFetchHtml('../src/InputView.html');
    });

    beforeEach(() => {
        callback.mockClear();
        fatalFnMock.mockClear();
    });

    test.each([
        ["0",{value: 0}],
        ["1",{value: 1}],
        ["-1",{value: -1}],
        ["1024",{value: 1024}],
        ["-1024",{value: -1024}],
        ["&0", {error: 'Darf nur eine Ganzzahl sein'}],
        ["1.5", {error: 'Darf nur eine Ganzzahl sein'}],
        ["+2,7", {error: 'Darf nur eine Ganzzahl sein'}],
        ["8hp!", {error: 'Darf nur eine Ganzzahl sein'}],
        ["Fünf", {error: 'Darf nur eine Ganzzahl sein'}]
    ])('parseInt()', async (input, solution) => {
        expect(InputView.parseInt(input)).toStrictEqual(solution);
    });

    test.each([
        ["0",{value: [0]}],
        ["1,2",{value: [1,2]}],
        ["-1,4,5",{value: [-1,4,5]}],
        ["1024,1,2,3,4,5,6,7,8,9",{value: [1024,1,2,3,4,5,6,7,8,9]}],
        ["-1024,-1024,-1024,-1024",{value: [-1024,-1024,-1024,-1024]}],
        ["&0",{error: `${'Darf nur eine Ganzzahl sein'} (Position ${0})`}],
        ["0,1.5",{error: `${'Darf nur eine Ganzzahl sein'} (Position ${1})`}],
        ["2,,7",{error: `${'Darf nur eine Ganzzahl sein'} (Position ${1})`}],
        ["8hp!",{error: `${'Darf nur eine Ganzzahl sein'} (Position ${0})`}],
        ["Fünf",{error: `${'Darf nur eine Ganzzahl sein'} (Position ${0})`}]
    ])('parseIntArray()', async (input, solution) => {
        expect(InputView.parseIntArray(input)).toStrictEqual(solution);
    });

    test.each([
        ["0",{value: "0"}],
        ["eins",{value: "eins"}],
        ["zw31",{value: "zw31"}]
    ])('parseString()', async (input, solution) => {
        expect(InputView.parseString(input)).toStrictEqual(solution);
    });

    test.each([
        [[
            {
              name: 'Werte',
              field: 'arr',
              type: 'integer[]',
              prefill: () => _.join([0,1,2]),
              validators: [ /*{
                func: arrayEveryEntry(minMax),
                param: { min: 0 },
              },*/
              {
                func: arrayEveryEntry(notEmpty),
              },
            ],
            },
          ],{arr: [0,1,2]}]
    ])('getValues()', async (inputs, solution) => {
        const inputView = new InputView(document.body, singletonManager, callback)
        await inputView.initPromise;
        inputView.loadConfig(inputs);
        expect(inputView.getValues()).toStrictEqual(solution);
    });

    test.each([
        [[
            {
              name: 'Werte',
              field: 'arr',
              type: 'Intätschor[]',
              prefill: () => _.join([0,1,2]),
              validators: [
              {
                func: arrayEveryEntry(notEmpty),
              },
            ],
            },
          ]]
    ])('klappt nicht', async (inputs) => {
        const inputView = new InputView(document.body, singletonManager, callback)
        await inputView.initPromise;
        inputView.loadConfig(inputs);
        expect(fatalFnMock).toBeCalledTimes(1);
    });

    test.each([
        [[
            {
              name: 'Werte',
              field: 'arr',
              type: 'integer[]',
              prefill: () => _.join([0,1,2]),
              validators: [ /*{
                func: arrayEveryEntry(minMax),
                param: { min: 0 },
              },*/
              {
                func: arrayEveryEntry(notEmpty),
              },
            ],
            },
          ],{arr: [0,1,2]}]
    ])('setDisabled()', async (inputs, solution) => {
        const inputView = new InputView(document.body, singletonManager, callback)
        await inputView.initPromise;
        inputView.loadConfig(inputs);
        inputView.setDisabled('Werte')
        document.getElementsByTagName(inputs)[0].elm.disabled.toBe('Werte')
    });
});

// für Disable: document.getElementsByTagName