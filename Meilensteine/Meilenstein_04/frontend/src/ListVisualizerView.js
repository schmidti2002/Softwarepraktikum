import VisualizerView from './VisualizerView';
import cytoscape from 'cytoscape';

// Visualisiert ein Array von Zahlen als Säulendiagram
export default class ListVisualizerView extends VisualizerView {
  constructor(parentNode, eventReporter) {
    super('ListVisualizerView', parentNode, eventReporter);
    this.initPromise.then(() => {
      this.container = document.getElementById('listview-container');
    });
  }

  renderData(startNode) {
    if(startNode === null){
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
      return;
    }

    var elements = { nodes: [], edges: [] };
  
    var visited = new Set();
    var queue = [startNode];
  
    while (queue.length > 0) {
      var currentNode = queue.shift();
      visited.add(currentNode.getData());
  
      elements.nodes.push({ data: { id: currentNode.getData() } });
  
      var nextNode = currentNode.getNext();
      if (nextNode) {
        elements.edges.push({ data: { source: currentNode.getData(), target: nextNode.getData() } });
        if (!visited.has(nextNode.getData())) {
          queue.push(nextNode);
        }
      }
    }
  
    var cy = window.cy = cytoscape({
      container: this.container, // wird zu this.container
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
  // Ausgabe der Liste in der Visualisierung
  // data ist das erste Element des stateChangeCallback() in showOutput() in SingleLinkedListLogic.js
  /*renderData(data) {
    //const graphContainer = document.getElementById('graph');
    const graphContainer = this.container;
    graphContainer.innerHTML = '';

    //let currentNode = this.exec.state.vars.front;
    let currentNode = data;
    let position = 0;

    while (currentNode !== null) {
      const nodeElement = document.createElement('div');
      nodeElement.classList.add('node');
      nodeElement.textContent = currentNode.getData();
      //nodeElement.textContent = ""

      // Setze die Position des Knotens basierend auf der Position
      // Abstand zwischen den Knoten: 60px, Start bei 50px:
      nodeElement.style.left = `${(position * 90) + 50}px`;
      nodeElement.style.top = '50px'; // Abstand vom oberen Rand: 50px

      graphContainer.appendChild(nodeElement);

      // Verbindungspfeile zwischen den Knoten auf der Höhe der Knoten
      if (position > 0) {
        const arrowElement = document.createElement('div');
        arrowElement.classList.add('arrow');
        // Position der Mitte zwischen den Knoten:
        arrowElement.style.left = `${(position * 90) + 0}px`;
        arrowElement.style.top = '70px'; // Setze die Höhe des Pfeils auf 70px (oder nach Bedarf)
        graphContainer.appendChild(arrowElement);

        // Erstelle das Dreieck (Pfeilspitze)
        const arrowTipElement = document.createElement('div');
        arrowTipElement.classList.add('arrow_tip');
        arrowElement.appendChild(arrowTipElement);

        graphContainer.appendChild(arrowElement);
      }

      currentNode = currentNode.getNext();
      position++;
    }

    // Zeige den Graphen an
    graphContainer.style.display = 'flex';
  }
}*/