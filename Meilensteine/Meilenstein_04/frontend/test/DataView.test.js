import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import DataView from '../src/DataView';
import { mockFetchHtml } from './testUtils.test';

describe('DataView', () => {
  let dataView;
  let mockContainer;
  let mockEventReporter;

  beforeEach(async () => {
    mockFetchHtml('../src/DataView.html');
    
    mockEventReporter = {
      fatal: jest.fn(),
    };

    dataView = new DataView(document.body, mockEventReporter);
    mockContainer = document.getElementById('dataview-container');
    await dataView.initPromise; 

    jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('initializes with provided parentNode and mockEventReporter', async () => {
      expect(dataView).toBeDefined();
      expect(mockContainer).toBeDefined(); 
    });
  });

  describe('error handling', () => {
    test('handles missing container element gracefully', async () => {
      document.getElementById.mockReturnValueOnce(null);
      const localDataView = new DataView(document.body, mockEventReporter);
      await localDataView.initPromise;
      expect(mockEventReporter.fatal).toHaveBeenCalled(); 
    });
  });

  describe('showEmpty method', () => {
    test('displays "Placeholder for nothing to show"', async () => {
      dataView.showEmpty();
      expect(mockContainer.innerHTML).toBe('Placeholder for nothing to show');
    });
  });

  describe('renderData method', () => {
    test.each([
      [{ key: 'value' }, 'key:', 'value', '.dataview-type-object'],
      [123, '123', null, '.dataview-type-number'],
      ['test string', 'test string', null, '.dataview-type-string'],
      [[], '', null, null],
      [{}, '', null, null],
      [null, 'Placeholder for nothing to show', null, null],
      [undefined, 'Placeholder for nothing to show', null, null],
      [['one', 'two', 'three'], 'one', 'two', null],
      [{ parent: { child: 'value' } }, 'parent:', 'child:', '.dataview-type-object'],
    ])('renders %p correctly', async (input, expectedInnerHTML, expectedValue, expectedClass) => {
      dataView.renderData(input);
      expect(mockContainer.innerHTML).toContain(expectedInnerHTML);
      if (expectedValue !== null) {
        expect(mockContainer.innerHTML).toContain(expectedValue);
      }
      if (expectedClass !== null) {
        const renderedElements = mockContainer.querySelectorAll(expectedClass);
        expect(renderedElements.length).toBeGreaterThan(0);
      }
    });
  });

  describe('handling of null and undefined data', () => {
    test('calls showEmpty for null data', async () => {
      dataView.showEmpty = jest.fn();
      dataView.renderData(null);
      expect(dataView.showEmpty).toHaveBeenCalled();
    });

    test('calls showEmpty for undefined data', async () => {
      dataView.showEmpty = jest.fn();
      dataView.renderData(undefined);
      expect(dataView.showEmpty).toHaveBeenCalled();
    });
  });

  describe('Styling of rendered data based on data type', () => {
    const testDataTypes = [
      { type: 'object', data: { key: 'value' }, expectedClass: '.dataview-type-object' },
      { type: 'number', data: 123, expectedClass: '.dataview-type-number' },
      { type: 'string', data: "Hello", expectedClass: '.dataview-type-string' },
    ];
  
    testDataTypes.forEach(({ type, data, expectedClass }) => {
      test(`applies correct class for ${type} type`, async () => {
        dataView.renderData(data);
        const renderedElements = mockContainer.querySelectorAll(expectedClass);
        expect(renderedElements.length).toBeGreaterThan(0);
      });
    });
  })

  describe('Snapshot Tests', () => {
    test('snapshot with simple data object', () => {
      const testData = { key: 'value' };
      dataView.renderData(testData);
      expect(mockContainer.innerHTML).toMatchSnapshot();
    });

    test('snapshot with nested data object', () => {
      const testData = { parent: { child: 'value' } };
      dataView.renderData(testData);
      expect(mockContainer.innerHTML).toMatchSnapshot();
    });

    test('snapshot with array data', () => {
      const testData = ['one', 'two', 'three'];
      dataView.renderData(testData);
      expect(mockContainer.innerHTML).toMatchSnapshot();
    });
  });
});