import {
  describe, expect, it, beforeAll,
} from '@jest/globals';
import SortVisualizerView from '../src/SortVisualizerView';
import SingletonManager from '../src/SingletonManager';
import { mockFetchHtml } from './testUtils.test';

describe('SortVisualizerView.test.js', () => {
  mockFetchHtml('../src/SortVisualizerView.html');
  let sortVisualizerView;
  beforeAll(() => {
    // Mock the HTML structure expected by the component
    document.body.innerHTML = '<div id="sortview-container"></div>';

    // Create an instance of SortVisualizerView
    sortVisualizerView = new SortVisualizerView(document.createElement('div'), (new SingletonManager()).get('EventReporter'));

    // Return the initPromise to ensure it resolves before tests
    return sortVisualizerView.initPromise;
  });

  it.each([
    [0, 1, 2, 3, 4, 5],
    [50, 10, 42],
    [1, 5, 13, 20],
  ])('renderData test', (data) => {
    sortVisualizerView.renderData(data);
    expect(sortVisualizerView.container.innerHTML).toMatchSnapshot();
  });
});
