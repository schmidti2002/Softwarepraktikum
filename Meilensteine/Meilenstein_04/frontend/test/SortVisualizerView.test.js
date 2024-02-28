import {
  describe, expect, it, beforeAll,
} from '@jest/globals';
import SortVisualizerView from '../src/SortVisualizerView';
import { mockFetchHtml } from './testUtils.test';

describe('SortVisualizerView.test.js', () => {
  mockFetchHtml('../src/SortVisualizerView.html');
  let sortVisualizerView;
  beforeAll(() => {
    sortVisualizerView = new SortVisualizerView(document.body, {});

    // initPromise zurück geben, so dass die Tests erst danach ausgeführt werden
    // (jest wartet auf das Promis)
    return sortVisualizerView.initPromise;
  });

  it.each([
    [[0, 1, 2, 3, 4, 5]],
    [[50, 10, 42]],
    [[1, 5, 13, 20]],
  ])('renderData test', async (data) => {
    sortVisualizerView.renderData(data);
    expect(sortVisualizerView.container.outerHTML).toMatchSnapshot();
  });
});
