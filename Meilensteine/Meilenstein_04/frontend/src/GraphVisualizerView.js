import VisualizerView from './VisualizerView';
import cytoscape from 'cytoscape';

// Visualisiert ein Array von Zahlen als Säulendiagram
export default class GraphVisualizerView extends VisualizerView {
  constructor(parentNode, eventReporter) {
    super('GraphVisualizerView', parentNode, eventReporter);
    this.initPromise.then(() => {
      this.container = document.getElementById('graphview-container');
    });
  }

  // Ausgabe der Liste in der Visualisierung
  // data ist das erste Element des stateChangeCallback() in showOutput() in SingleLinkedListLogic.js
  // Methode zur Visualisierung des Graphen
 renderData(adjacencyList) {
  try{
    if(adjacencyList === null || adjacencyList === undefined || adjacencyList.length === 0){
        while (this.container.firstChild) {
          this.container.removeChild(this.container.firstChild);
        }
        this.eventReporter.info("Adjazenzliste ist leer");
        return;
    }
    this.container.innerHTML = '';
    var elements = { nodes: [], edges: [] };

    // Generate nodes and edges from adjacencyList
    adjacencyList.forEach(function (edge) {
      let currentNode = edge[0];
      let neighbors = edge.slice(1); // Remove the first element which is the current node
      let currentNodeId = currentNode.getData();

      // Add current node to the visual elements
      elements.nodes.push({ data: { id: currentNodeId } });

      // Add edges from current node to its neighbors
      neighbors.forEach(function (neighbor) {
        let neighborId = neighbor.getData();
        // Check if the edge already exists
        if (!elements.edges.some(function (edge) {
          return edge.data.source === currentNodeId && edge.data.target === neighborId;
        })) {
          elements.edges.push({ data: { source: currentNodeId, target: neighborId } });
        }
      });
    });

    // Initialize Cytoscape
    cy = window.cy = cytoscape({
      container: this.container,
      elements: elements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#00ba77',
            'label': 'data(id)',
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#808080',
            'target-arrow-color': '#808080',
            'target-arrow-shape': 'triangle',
            'curve-style': 'straight',
            'text-background-opacity': 1, // Opazität des Hintergrundfelds für Label (0 bis 1)
            'text-background-padding': '5px', // Abstand zwischen Label und Hintergrund
          }
        }
      ],
      layout: {
        name: 'circle',
        //name: 'breadthfirst',
        //name: 'cose',
        randomize: false,
        avoidOverlap: true,
      }
    });
  } catch (error) {}
  } 
}