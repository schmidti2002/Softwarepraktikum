import {
  expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import * as _ from 'lodash';
import BubbleSortLogic from '../src/BubbleSortLogic';
import AuDView from '../src/AuDView';
import CodeView from '../src/CodeView';
import DataView from '../src/DataView';
import InputView from '../src/InputView';
import SingletonManager from '../src/SingletonManager';
import {
  awaitAllAsync, delay, mockFetchHtml, mockReload,
} from './testUtils.test';
import { arrayEveryEntry, minMax, notEmpty } from '../src/inputValidators';

jest.mock('../src/BubbleSortLogic');
jest.mock('../src/CodeView');
jest.mock('../src/InputView');
jest.mock('../src/DataView');
//jest.mock('../src/SortVisualizerView');

describe('LoginView.js', () => {
  const singletonManager = new SingletonManager();
  const infoFnMock = jest.fn();
  const warnFnMock = jest.fn();
  const errorFnMock = jest.fn();
  const fatalFnMock = jest.fn();
  const renderCodeMock = jest.fn();
  const renderBreakpointsMock = jest.fn();
  const showEmptyCodeViewMock = jest.fn();
  const showEmptyDataViewMock = jest.fn();

  const bubbleSortConstructorMock = jest.fn(() => ({ algos: [{
    name: 'Werte',
    field: 'arr',
    type: 'integer[]',
    prefill: () => _.join([0, 1, 2]),
    validators: [ /* {
            func: arrayEveryEntry(minMax),
            param: { min: 0 },
          }, */
      {
        func: arrayEveryEntry(notEmpty),
      },
    ],
  },] }));

  const prepareInputViewMock = (username, password) => InputView.mockImplementationOnce(
    (parent, reporter, callback) => {
      expect(parent).toBeInstanceOf(Element);
      expect(reporter).toBeTruthy();
      expect(typeof callback).toBe('function');
      return {
        initPromise: delay(100),
        loadConfig: () => {},
        getValues: () => ({ username, password }),
        validate: () => username.length > 0 && password.length > 0,
      };
    },
  );

  const prepareCodeViewMock = () => CodeView.mockImplementationOnce(
    (parent, reporter) => {
      return {
        initPromise: delay(100),
        renderCode: () => {renderCodeMock},
        renderBreakpoints: () => {renderBreakpointsMock},
        showEmpty: () => {showEmptyCodeViewMock},
      };
    },
  );

  const prepareDataViewMock = () => DataView.mockImplementationOnce(
    (parent, reporter) => {
      return {
        initPromise: delay(100),
        showEmpty: () => {showEmptyDataViewMock},
      };
    },
  );

  beforeAll(() => {
    singletonManager.registerConstructor('EventReporter', () => ({
      info: infoFnMock,
      warn: warnFnMock,
      error: errorFnMock,
      fatal: fatalFnMock,
    }));

    mockFetchHtml('../src/AuDView.html');
    //fetch(src/AuDView.html);

    BubbleSortLogic.mockImplementation(bubbleSortConstructorMock);
  });

  beforeEach(() => {
    bubbleSortConstructorMock.mockClear();
    infoFnMock.mockClear();
    warnFnMock.mockClear();
    errorFnMock.mockClear();
    fatalFnMock.mockClear();
    renderCodeMock.mockClear();
    renderBreakpointsMock.mockClear();
    showEmptyCodeViewMock.mockClear();
    showEmptyDataViewMock.mockClear();
  });

  test('load BubbleSort', async () => {
    const audView = new AuDView(document.body, singletonManager);
    await audView.initPromise;
    audView.loadAuD('BubbleSort');
    await awaitAllAsync();
    expect(bubbleSortConstructorMock).toBeCalledTimes(1);
  });

  test('load wrong Algo', async () => {
    const audView = new AuDView(document.body, singletonManager);
    await audView.initPromise;
    audView.loadAuD('Bullshit');
    await awaitAllAsync();
    expect(fatalFnMock).toBeCalledTimes(1);
  });

  test('loadAlgoByIndex()', async () => {
    prepareCodeViewMock();
    prepareDataViewMock();
    const audView = new AuDView(document.body, singletonManager);
    await audView.initPromise;
    audView.loadAuD('BubbleSort');
    await awaitAllAsync();
    //audView.loadAlgoByIndex(0);
    await awaitAllAsync();
    //xpect(renderCodeMock).toBeCalledTimes(1);
    //expect(renderBreakpointsMock).toBeCalledTimes(1);
    //expect(showEmptyCodeViewMock).toBeCalledTimes(1);
    //expect(showEmptyDataViewMock).toBeCalledTimes(1);    
    expect(infoFnMock).toBeCalledTimes(1);
  });
});
