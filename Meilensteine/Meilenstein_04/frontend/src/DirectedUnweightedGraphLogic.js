import * as _ from 'lodash';
import { toInteger } from 'lodash';
import Logic from './Logic';
import { execFor, execIfElse, Executer } from './AlgoExecuter';
import { inputLength, minMax } from './inputValidators';

const lengthOfData = 20

// Node-Klasse
export class Node {
  // Möglicherweise sollte die Möglichkeit bestehen,
  // sich diese Klasse irgendwo anzeigen zu lassen

  constructor(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

}

// Klasse des ungerichteten ungewichteten Graphen
export default class DirectedUnweightedGraph extends Logic {
  // Konstruktor um DirectedUnweightedGraph mit Standardwerten zu laden
  constructor(eventReporter, stateChangeCallback) {
    super(eventReporter, stateChangeCallback);
    this.exec.changeAlgo(
      [],
      [1],
      1,
      this.#initGraph(),
    );
    this.showOutput();
  }

  // Initialisierung des Graphen mit Standardwerten
  #initGraph() {
    const adjlist = [];
    const list = [];
    list.push(new Node("A"));
    adjlist.push(list);
    
    //list[0][0] = new Node("A");
    //list[1][0] = new Node("B");
    //list[2][0] = new Node("C");
    //list[0][1] = list[1][0];
    //list[1][1] = list[2][0];
    return {adjList: adjlist};
  }
  
  algos = []


  showOutput() {
    this.stateChangeCallback(
      this.exec.state.vars.front,
      this.exec.state.vars,
      this.exec.state.currentLine,
      this.exec.isRunning(),
    );
  }
}