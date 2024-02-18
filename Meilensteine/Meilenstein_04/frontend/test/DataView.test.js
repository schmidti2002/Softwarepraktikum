import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import DataView from '../src/DataView'; // Stellen Sie sicher, dass der Pfad korrekt ist

describe('DataView', () => {
  let dataView;
  let mockParentNode;
  let mockErrorReporter;
  let mockContainer;

  beforeEach(async () => {
    // Einrichtung eines Mock-Containers im DOM
    document.body.innerHTML = `<div id="dataview-container"></div>`;
    mockContainer = document.getElementById('dataview-container');

    jest.spyOn(document, 'getElementById').mockImplementation((id) => {
      if (id === 'dataview-container') return mockContainer;
      return null;
    });

    mockParentNode = { appendChild: jest.fn() };
    mockErrorReporter = jest.fn();

    dataView = new DataView(mockParentNode, mockErrorReporter);

    // Wenn Ihre Komponente oder Basisklasse eine initPromise verwendet:
    if (dataView.initPromise) {
      await dataView.initPromise;
    }
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    test('initializes with provided parentNode and errorReporter', async () => {
      expect(dataView).toBeDefined();
      expect(document.getElementById).toHaveBeenCalledWith('dataview-container');
    });
  });

  describe('error handling', () => {
    test('handles missing container element gracefully', async () => {
      document.getElementById.mockReturnValueOnce(null);
      expect(() => new DataView(mockParentNode, mockErrorReporter)).not.toThrow();
    });
  });

  describe('showEmpty method', () => {
    test('displays "Placeholder for nothing to show"', async () => {
      dataView.showEmpty();
      expect(mockContainer.innerHTML).toBe('Placeholder for nothing to show');
    });
  });

  describe('renderData method', () => {
    // Tests für verschiedene Datentypen
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

    test('snapshot for showEmpty method', () => {
      dataView.showEmpty();
      expect(mockContainer.innerHTML).toMatchSnapshot();
    });
  });
});

