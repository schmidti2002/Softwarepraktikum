import {
    expect, describe, test, jest, beforeEach, beforeAll,
} from '@jest/globals';
import BubbleSortLogic from '../src/BubbleSortLogic';
import AuDView from '../src/AuDView';
import SingletonManager from '../src/SingletonManager';
import { awaitAllAsync, delay, mockFetchHtml, mockReload } from './testUtils.test.js';

jest.mock('../src/BubbleSortLogic');

describe('LoginView.js', () => {
    const singletonManager = new SingletonManager();
    const infoFnMock = jest.fn();
    const warnFnMock = jest.fn();
    const errorFnMock = jest.fn();
    const fatalFnMock = jest.fn();

    const bubbleSortConstructorMock = jest.fn(() => {
        return{algos: []}
    })

    beforeAll(() => {
        singletonManager.registerConstructor('EventReporter', () => ({  
            info: infoFnMock,
            warn: warnFnMock,
            error: errorFnMock,
            fatal: fatalFnMock,
        }));
  
        mockFetchHtml('../src/AuDView.html');

        BubbleSortLogic.mockImplementation(bubbleSortConstructorMock)
    });
    
    beforeEach(() => {
        bubbleSortConstructorMock.mockClear()
    });  
    
    test('load BubbleSort', async () => {
        const audView = new AuDView(document.body, singletonManager);
        await audView.initPromise;
        audView.loadAuD('BubbleSort');
        await awaitAllAsync();
        expect(bubbleSortConstructorMock).toBeCalledTimes(1);
    });
  
    
  });
  