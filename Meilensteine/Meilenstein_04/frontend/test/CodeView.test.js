import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import {
  CodeView,
  showEmpty,
  renderCode,
  renderBreakpoints,
  renderCurrentMarker
} from '../src/CodeView';

describe('CodeView', () => {
  let codeView;
  let mockParentNode;
  let mockErrorReporter;

  beforeEach(() => {
    mockParentNode = { appendChild: jest.fn() };
    mockErrorReporter = jest.fn();
    document.getElementById = jest.fn().mockReturnValue({
      innerHTML: '',
      appendChild: jest.fn(),
      firstChild: { childNodes: [{ classList: new Set() }, { classList: new Set() }, { classList: new Set() }] }
    });
    codeView = new CodeView(mockParentNode, mockErrorReporter);
  });

  describe('constructor', () => {
    test('initializes with provided parentNode and errorReporter', () => {
      expect(codeView).toBeDefined();
      expect(document.getElementById).toHaveBeenCalledWith('codeview-container');
    });
  });

  describe('error handling', () => {
    test('handles missing container element gracefully', () => {
      document.getElementById = jest.fn().mockReturnValue(null);
      expect(() => {
        new CodeView(mockParentNode, mockErrorReporter);
      }).not.toThrow();
    });
  });

  describe('showEmpty method', () => {
    test.each([
      ['Placeholder for nothing to show']
    ])('displays %s', (expected) => {
      showEmpty.call(codeView);
      const container = document.getElementById('codeview-container');
      expect(container.innerHTML).toBe(expected);
    });
  });

  describe('renderCode method', () => {
    test.each([
      [['line1', 'line2'], 'table'],
      [[], 'Placeholder for nothing to show'],
      [null, 'Placeholder for nothing to show']
    ])('renders correctly for %s', (input, expected) => {
      renderCode.call(codeView, input);
      const container = document.getElementById('codeview-container');
      expect(container.innerHTML).toContain(expected);
    });

    test.each([
      [['line1', ''], 'table', 'Should handle lines with empty string'],
      [undefined, 'Placeholder for nothing to show', 'Should handle undefined input'],
      [[''], 'table', 'Should render with a single empty line']
    ])('renders correctly for %s', (input, expected, description) => {
      renderCode.call(codeView, input);
      const container = document.getElementById('codeview-container');
      expect(container.innerHTML).toContain(expected);
    });
  });

  describe('renderBreakpoints method', () => {
    test.each([
      [[0], 0, true],
      [[1], 1, true],
      [[], 0, false],
      [[2], 1, false]
    ])('adds break class for breakpoints %s', (breakpoints, line, expected) => {
      renderCode.call(codeView, ['line1', 'line2', 'line3']);
      renderBreakpoints.call(codeView, breakpoints);
      const childNodes = document.getElementById('codeview-container').firstChild.childNodes;
      expect(childNodes[line].classList.contains('break')).toBe(expected);
    });

    test.each([
      [[0, 2], [true, false, true], 'Should add break class to multiple lines'],
      [[], [false, false, false], 'Should not add break class when empty array is passed'],
      [[3], [false, false, false], 'Should handle out of bounds index']
    ])('handles breakpoints %s', (breakpoints, expectedClasses, description) => {
      renderCode.call(codeView, ['line1', 'line2', 'line3']);
      renderBreakpoints.call(codeView, breakpoints);
      const childNodes = document.getElementById('codeview-container').firstChild.childNodes;
      childNodes.forEach((node, index) => {
        expect(node.classList.contains('break')).toBe(expectedClasses[index]);
      });
    });
  });

  describe('renderCurrentMarker method', () => {
    test.each([
      [0, true],
      [1, true],
      [2, false] 
    ])('adds line class for line %s', (line, expected) => {
      renderCode.call(codeView, ['line1', 'line2', 'line3']);
      renderCurrentMarker.call(codeView, line);
      const childNodes = document.getElementById('codeview-container').firstChild.childNodes;
      expect(childNodes[line].classList.contains('line')).toBe(expected);
    });

    test.each([
      [3, false, 'Should handle out of bounds index'],
      [-1, false, 'Should handle negative index']
    ])('marks line %s as current', (line, expected, description) => {
      renderCode.call(codeView, ['line1', 'line2', 'line3']);
      renderCurrentMarker.call(codeView, line);
      const childNodes = document.getElementById('codeview-container').firstChild.childNodes;
      const isMarked = line >= 0 && line < childNodes.length ? childNodes[line].classList.contains('line') : false;
      expect(isMarked).toBe(expected);
    });
  });

  describe('handling of unusual inputs', () => {
    test.each([
      ['very long string'.repeat(1000), 'table', 'Should handle extremely long strings'],
      [{}, 'Placeholder for nothing to show', 'Should handle non-string input']
    ])('renderCode handles %s', (input, expected, description) => {
      renderCode.call(codeView, [input]);
      const container = document.getElementById('codeview-container');
      expect(container.innerHTML).toContain(expected);
    });
  });
});
