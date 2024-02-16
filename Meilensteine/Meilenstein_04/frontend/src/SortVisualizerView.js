import VisualizerView from './VisualizerView';

// Visualisiert ein Array von Zahlen als Säulendiagram
export default class SortVisualizerView extends VisualizerView {
  constructor(parentNode, eventReporter) {
    super('SortVisualizerView', parentNode, eventReporter);
    this.initPromise.then(() => {
      this.container = document.getElementById('sortview-container');
    });
  }

  renderData(data) {
    this.container.innerHTML = '';

    for (let i = 0; i < data.length; i++) { // For erstellt alle Bars
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.width = '20px'; // Skaliere Breite der Bars

      // Skaliere die Höhe der Bars:
      bar.style.height = `${data[i] * 10 + 10}px`;
      bar.innerHTML = `<span>${data[i]}</span>`;
      this.container.appendChild(bar);
    }
  }
}
