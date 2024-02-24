import { describe, expect, it } from '@jest/globals';
import SortVisualizerView from '../src/SortVisualizerView';
import SingletonManager from '../src/SingletonManager';

describe('SortVisualizerView.test.js', () => {
  // bringt den Fehler, dass fetch bei View.js nicht funktioniert, und man node-fetch nehmen soll.
  // Ich wollte aber nicht in View.js rumwerkeln.
  const sortVisualizerView = new SortVisualizerView(document.createElement('div'), (new SingletonManager()).get('EventReporter'));
  sortVisualizerView.container = document.createElement('div');

  it.each([
    [0, 1, 2, 3, 4, 5],
    [50, 10, 42]])('renderData test', (data) => {
    expect(sortVisualizerView.renderData(data)).toMatchSnapshot();
  });
});
