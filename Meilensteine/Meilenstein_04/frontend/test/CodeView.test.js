import { describe, expect, jest, beforeEach } from '@jest/globals';
import CodeView from '../src/CodeView';
import { awaitAllAsync, mockFetchHtml } from './testUtils.test';


describe('CodeView', () => {
  let codeView;
  let mockParentNode;
  let mockEventReporter;
  let mockContainer

  beforeEach(async() => {
    mockFetchHtml('../src/CodeView.html');

    mockEventReporter = {
      fatal: jest.fn(),
    };

    codeView = new CodeView(mockParentNode, mockEventReporter);
    await codeView.initPromise; 
    await awaitAllAsync();
    mockContainer = document.getElementById('codeview-container');

    jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('constructor initializes with provided parentNode and eventReporter', () => {
    expect(codeView).toBeDefined();
    expect(document.getElementById).toHaveBeenCalledWith('codeview-container');
  });

  test('handles missing container element gracefully and reports fatal error', () => {
    document.getElementById = jest.fn().mockReturnValue(null);
    new CodeView(mockParentNode, mockEventReporter);
    expect(mockEventReporter.fatal).toHaveBeenCalled();
  });

  test('showEmpty displays correct placeholder', () => {
    codeView.showEmpty();
    expect(mockContainer.innerHTML).toBe('Placeholder for nothing to show');
  });

  describe('renderCode method', () => {
    test.each([
      [['line1', 'line2'], 'table', 'Renders table for non-empty input'],
      [[], 'Placeholder for nothing to show', 'Displays placeholder for empty array'],
      [null, 'Placeholder for nothing to show', 'Displays placeholder for null'],
      [undefined, 'Placeholder for nothing to show', 'Handles undefined input'],
      [[''], 'table', 'Renders table with a single empty line'],
      [['line1', ''], 'table', 'Handles lines with empty string']
    ])('correctly renders for %s', (input, expected, description) => {
      codeView.renderCode(input);
      expect(mockContainer.innerHTML).toContain(expected);
    });
  });

  describe('renderBreakpoints method', () => {
    test.each([
      [[0], 1, 'Adds break class for the first line'],
      [[1, 2], 2, 'Adds break class for the second & third line'],
      [[3], 0, 'Does not add break class for out of range index']
    ])('correctly handles breakpoints for line %s', (line, expected, description) => {
      codeView.renderCode(['line1', 'line2', 'line3']);
      codeView.renderBreakpoints([line]);
      const breakClassCount = document.getElementsByClassName('break').length;
      expect(breakClassCount).toBe(expected);
    });
  });

  describe('renderCurrentMarker method', () => {
    test.each([
      [0, 1, 'Marks first line as current'],
      [1, 1, 'Marks second line as current'],
      [2, 0, 'Does not mark out of bounds line as current']
    ])('correctly marks line %s as current', (line, expected) => {
      codeView.renderCode(['line1', 'line2', 'line3']);
      codeView.renderCurrentMarker(line);
      const lineClassCount = document.getElementsByClassName('line').length;
      expect(lineClassCount).toBe(expected);
    });
  });
  describe('handling of unusual inputs', () => {
    test.each([
      ['very long string'.repeat(1000), 'table', 'Should handle extremely long strings'],
      [{}, 'Placeholder for nothing to show', 'Should handle non-string input']
    ])('correctly handles %s', (input, expected) => {
      codeView.renderCode([input]);
      expect(mockContainer.innerHTML).toContain(expected);
    });
  });
});
