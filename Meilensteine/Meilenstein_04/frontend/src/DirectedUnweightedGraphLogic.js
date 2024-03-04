import * as _ from 'lodash';
import { toInteger } from 'lodash';
import Logic from './Logic';
import { execFor, execIfElse, Executer } from './AlgoExecuter';
import { inputLength, minMax } from './inputValidators';

const lengthOfData = 20

// Node-Klasse
export class Node {
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
    let nodeA = new Node("A");
    let nodeB = new Node("B");
    let nodeC = new Node("C");
    let nodeD = new Node("D");
    const alist = [];
    let list = [];
    list.push(nodeA);
    list.push(nodeB);
    alist.push(list);
    list = [];
    list.push(nodeB);
    list.push(nodeC);
    alist.push(list);
    list = [];
    list.push(nodeC);
    alist.push(list);
    list = [];
    list.push(nodeD);
    list.push(nodeB);
    alist.push(list);
    return {adjList: alist};
  }
  
  algos = []

  jsExampleInsertNode = [
    'if (this.adjList === null) {',
    '  this.adjList = [[]];',
    '  this.adjList[0].push(new Node(data));',
      'return true;',
    '}',
    'for (let i = 0; i < this.adjList.length; i++) {',
      'if (this.adjList[i][0].getData() === data) {',
        'console.error("Exception in thread \"main\" java.lang.IOExeption: node already in graph");',
        'return false;',
        '  }',
        '}',
        'this.adjList.push([]);',
        'this.adjList[this.adjList.length - 1].push(new Node(data));',
        'return true;',
        '}',
        '}',
        ];

linesForInsertNode = [
    ...execIfElse((s) => s.vars.adjList === null, [
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList = [[]]; return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList[0].push(new Node(s.vars.data)); return s; } },
    ]

]

  showOutput() {
    this.stateChangeCallback(
      this.exec.state.vars.adjList,
      this.exec.state.vars,
      this.exec.state.currentLine,
      this.exec.isRunning(),
    );
  }
}