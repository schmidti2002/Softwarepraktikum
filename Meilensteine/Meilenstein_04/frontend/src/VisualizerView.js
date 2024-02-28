import View from './View';

// Basisklasse für alle VisualizerViews
export default class VisualizerView extends View {
  renderData(data) {
    this.eventReporter.fatal(`Visualizer not fully implemented! Could not render ${JSON.stringify(data)}`);
  }
}
