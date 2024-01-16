import VisualizerView from './VisualizerView';

export default class SortVisualizerView extends VisualizerView {
  constructor(parentNode, errorReporter) {
    super('SortVisualizerView', parentNode, errorReporter);
    this.initPromise.then(() => {
      this.container = document.getElementById('sortview-container');
    });
  }

  renderData(data) {
    this.container.innerText = JSON.stringify(data);
  }
}
