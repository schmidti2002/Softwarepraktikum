import VisualizerView from './VisualizerView';

// Visualisiert ein Array von Zahlen als Säulendiagram
export default class GraphVisualizerView extends VisualizerView {
  constructor(parentNode, eventReporter) {
    super('GraphVisualizerView', parentNode, eventReporter);
    this.initPromise.then(() => {
      this.container = document.getElementById('listview-container');
    });
  }

  // Ausgabe der Liste in der Visualisierung
  // data ist das erste Element des stateChangeCallback() in showOutput() in SingleLinkedListLogic.js
  renderData(adjacencyList) {
    var elements = { nodes: [], edges: [] };

    // Generate nodes
    adjacencyList.forEach(function (neighbors, node) {
        elements.nodes.push({ data: { id: node.getData() } });
        neighbors.forEach(function (neighbor) {
        if (!elements.edges.some(function (edge) {
            return edge.data.source === neighbor.getData() && edge.data.target === node.getData();
        })) {
            elements.edges.push({ data: { source: node.getData(), target: neighbor.getData() } });
        }
        });
    });

    var cy = this.container = cytoscape({
        container: document.getElementById('cy'),
        elements: elements,
        style: [
        {
            selector: 'node',
            style: {
            'background-color': '#ffa54f',
            'label': 'data(id)'
            }
        },
        {
            selector: 'edge',
            style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle',
            'curve-style': 'straight'
            }
        }
        ],
        layout: {
        name: 'grid',
        rows: 1
        }
    });
}
}