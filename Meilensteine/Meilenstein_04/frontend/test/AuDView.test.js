import {
  expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import * as _ from 'lodash';
import BubbleSortLogic from '../src/BubbleSortLogic';
import AuDView from '../src/AuDView';
import CodeView from '../src/CodeView';
import DataView from '../src/DataView';
import InputView from '../src/InputView';
import SortVisualizerView from '../src/SortVisualizerView';
import SingletonManager from '../src/SingletonManager';
import {
  awaitAllAsync, delay, mockFetchHtml, mockReload,
} from './testUtils.test';
import { arrayEveryEntry, minMax, notEmpty } from '../src/inputValidators';

jest.mock('../src/BubbleSortLogic');
jest.mock('../src/CodeView');
jest.mock('../src/InputView');
jest.mock('../src/DataView');
jest.mock('../src/SortVisualizerView');

describe('AuDView.js', () => {
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
  },
  {
    name: 'Sortieren',
    algo: {
      code: [],
      lines: [],
      breakpoints: [],
    },
    inputs: [
      {
        name: 'Werte',
        field: 'arr',
        type: 'integer[]',
        prefill: () => _.join([0, 1, 2]),
        validators: [{
          func: arrayEveryEntry(minMax),
          param: { min: 0 },
        },
        {
          func: arrayEveryEntry(notEmpty),
        },
        ],
      },
    ],
  },
  {
    name: 'Neue Werte',
    func: (inputs) => {},
    inputs: [
      {
        name: 'Anzahl',
        field: 'count',
        type: 'integer',
        validators: [{
          func: minMax,
          param: { min: 0, max: 200 },
        },
        {
          func: notEmpty,
        },
        ],
      },
    ],
  },], 
  loadAlgoByIndex: ()=>{},
}));

  const prepareInputViewMock = (username, password) => InputView.mockImplementation(
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

  const prepareCodeViewMock = () => CodeView.mockImplementation(
    (parent, reporter) => {
      return {
        initPromise: delay(100),
        renderCode: renderCodeMock,
        renderBreakpoints: renderBreakpointsMock,
        showEmpty: showEmptyCodeViewMock,
      };
    },
  );

  const prepareDataViewMock = () => DataView.mockImplementation(
    (parent, reporter) => {
      return {
        initPromise: delay(100),
        showEmpty: showEmptyDataViewMock,
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
    
    SortVisualizerView.mockImplementation(()=>({initPromise: delay(100), renderData: () => {},}));   

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
    await audView.visualizerView.initPromise;
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
    await audView.visualizerView.initPromise;
    audView.loadAlgoByIndex(1);
    await awaitAllAsync();
    expect(renderCodeMock).toBeCalledTimes(1);
    expect(renderBreakpointsMock).toBeCalledTimes(1);
    expect(showEmptyCodeViewMock).toBeCalledTimes(0);
    expect(showEmptyDataViewMock).toBeCalledTimes(0);    
    expect(fatalFnMock).toBeCalledTimes(0);
  });

  test('loadAlgoByIndex()', async () => {
    prepareCodeViewMock();
    prepareDataViewMock();
    const audView = new AuDView(document.body, singletonManager);
    await audView.initPromise;
    audView.loadAuD('BubbleSort');
    await audView.visualizerView.initPromise;
    audView.loadAlgoByIndex(2);
    await awaitAllAsync();
    expect(renderCodeMock).toBeCalledTimes(0);
    expect(renderBreakpointsMock).toBeCalledTimes(0);
    expect(showEmptyCodeViewMock).toBeCalledTimes(1);
    expect(showEmptyDataViewMock).toBeCalledTimes(1);    
    expect(fatalFnMock).toBeCalledTimes(0);
  });

  test('loadAlgoByIndex()', async () => {
    prepareCodeViewMock();
    prepareDataViewMock();
    const audView = new AuDView(document.body, singletonManager);
    await audView.initPromise;
    audView.loadAuD('BubbleSort');
    await audView.visualizerView.initPromise;
    audView.loadAlgoByIndex(0);
    await awaitAllAsync();
    expect(renderCodeMock).toBeCalledTimes(0);
    expect(renderBreakpointsMock).toBeCalledTimes(0);
    expect(showEmptyCodeViewMock).toBeCalledTimes(0);
    expect(showEmptyDataViewMock).toBeCalledTimes(0);    
    expect(fatalFnMock).toBeCalledTimes(1);
  });
});
