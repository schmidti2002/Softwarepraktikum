import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import DataView from '../src/DataView';

describe('DataView', () => {
  let dataView;
  let mockContainer;
  let eventReporter;

  beforeEach(async () => {
    jest.spyOn(global, 'fetch').mockImplementation(mockFetchHtml);

    await mockFetchHtml('inputView.html');
    mockContainer = document.getElementById('dataview-container');
    
    eventReporter = {
      warn: jest.fn(),
      error: jest.fn(),
      fatal: jest.fn(),
    };

    dataView = new DataView(document.body, eventReporter);
    await dataView.initPromise; 
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('initializes with provided parentNode and eventReporter', async () => {
      expect(dataView).toBeDefined();
      expect(mockContainer).toBeDefined(); 
    });
  });

  describe('error handling', () => {
    test('handles missing container element gracefully', async () => {
      document.getElementById.mockReturnValueOnce(null);
      const localDataView = new DataView(document.body, eventReporter);
      await localDataView.initPromise;
      expect(() => new DataView(document.body, eventReporter)).not.toThrow();
      expect(eventReporter.fatal).toHaveBeenCalled(); 
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
    test('applies correct class for object type', async () => {
      const objectData = { key: 'value' };
      dataView.renderData(objectData);
      const renderedObjects = mockContainer.querySelectorAll('.dataview-type-object');
      expect(renderedObjects.length).toBeGreaterThan(0);
    });

    test('applies correct class for number type', async () => {
      const numberData = 123;
      dataView.renderData(numberData);
      const renderedNumbers = mockContainer.querySelectorAll('.dataview-type-number');
      expect(renderedNumbers.length).toBeGreaterThan(0);
    });

    test('applies correct class for string type', async () => {
      const stringData = "Hello";
      dataView.renderData(stringData);
      const renderedStrings = mockContainer.querySelectorAll('.dataview-type-string');
      expect(renderedStrings.length).toBeGreaterThan(0);
    });
  });

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