import View from './View';

export default class VisualizerView extends View {
  renderData(data) {
    this.errorReporter.error(`Visualizer not fully implemented! Could not render ${JSON.stringify(data)}`);
  }
}
