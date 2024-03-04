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
    this.exec.outputFunction = () => {
        this.showOutput();
      };
    this.showOutput();
  }

  // Initialisierung des Graphen mit Standardwerten
  #initGraph() {
    let nodeA = new Node("A");
    let nodeB = new Node("B");
    let nodeC = new Node("C");
    let nodeD = new Node("D");
    return {adjList: [[nodeA, nodeB],[nodeB, nodeC, nodeD],[nodeC,nodeA],[nodeD]]};
  }
  
  jsExampleInsertNode = [
    'if (this.adjList === null) {',
    '  this.adjList = [[]];',
    '  this.adjList[0].push(new Node(data));',
      'return true;',
    '}',
    'for (let i = 0; i < this.adjList.length; i++) {',
    '   if (this.adjList[i][0].getData() === data) {',
    '       console.error("Exception in thread \"main\" java.lang.IOExeption: node already in graph");',
    '       return false;',
    '   }',
    '}',
    'this.adjList.push([]);',
    'this.adjList[this.adjList.length - 1].push(new Node(data));',
    'return true;',
    ];

    linesForInsertNode = [
        ...execIfElse((s) => s.vars.adjList === null, [
            { f(os) { const s = _.cloneDeep(os); s.vars.adjList = [[]]; return s; } },
            { f(os) { const s = _.cloneDeep(os); s.vars.adjList[0].push(new Node(s.vars.data)); return s; } },
        ],[
            ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
                ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.data, [
                    {}
                ]),]),
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList.push([]); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList[s.vars.adjList.length-1].push(new Node(s.vars.data)); return s; } },
        ]),
    ]

    jsExampleInsertEdge = [   
        'if (!adjList) {',
        '   console.error("Exeption in thread \"main\" java.lang.NullPointerExeption: graph is empty");',
        '   return false;',
        '}',
        'let indexNodeOne = -1, indexNodeTwo = -1;',
        'for (let i = 0; i < adjList.length; i++) {',
        '   if (adjList[i][0].getData() === nodeOne) {',
        '       indexNodeOne = i;',
        '   }',
        '   if (adjList[i][0].getData() === nodeTwo) {',
        '       indexNodeTwo = i;',
        '   }',
        '}',
        'for (let i = 1; i < adjList[indexNodeOne].length; i++) {',
        '   if (adjList[indexNodeOne][i].getData() === nodeTwo) {',
        '       indexNodeTwo = -2;',
        '   }',
        '}',
        'if (indexNodeOne === -1 || indexNodeTwo === -1) {',
        '   console.error("Exeption in thread \"main\" java.lang.IOExeption: node not in graph");',
        '   return false;',
        '}',
        'if (indexNodeTwo === -2) {console.error("Exeption in thread \"main\" java.lang.IOExeption: edge already in graph");',
        '   return false;',
        '}',
        'adjList[indexNodeOne].push(adjList[indexNodeTwo][0]);',
        'return true;',
    ]

    linesForInsertEdge = [
        { f(os) { const s = _.cloneDeep(os); s.vars.indexNodeOne = -1; s.vars.indexNodeTwo = -1; return s; } },
        ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
            ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.nodeOne, [
                { f(os) { const s = _.cloneDeep(os); s.vars.indexNodeOne = s.vars.i; return s; } },
            ]),
            ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.nodeTwo, [
                { f(os) { const s = _.cloneDeep(os); s.vars.indexNodeTwo = s.vars.i; return s; } },
            ]),
        ]),
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList[s.vars.indexNodeOne].push(s.vars.adjList[s.vars.indexNodeTwo][0]); return s; } },
    ]

    /*jsExampleSearchNodeID(String data) { // vielleicht getEdgesOfNode
    if (!adjList) {
        console.error("Exception: graph is empty");
        return -1;
    }

    for (let i = 0; i < adjList.length; i++) {
        if (adjList[i][0].getData() === data) {
            return i;
        }
    }

    console.error("Exception: node not in graph");
    return -1;
    }*/

    jsExampleRemoveEdge = [
    'if (!adjList) {',
    '   console.error("Exception: graph is empty");',
    '   return false;',
    '}',
    'for (let i = 0; i < adjList.length; i++) {',
    '   if (adjList[i][0].getData() === nodeOne) {',
    '       for (let k = 0; k < adjList[i].length; k++) {',
    '           if (adjList[i][k].getData() === nodeTwo) {',
    '               adjList[i].splice(k, 1);',
    '               return true;',
    '           }',
    '       }',
    '       console.error("Exception: edge not in graph");',
    '       return false;',
    '   }',
    '}',
    'console.error("Exception: node not in graph");',
    'return false;',
    ]

    linesForRemoveEdge = [
        ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
            ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.nodeOne, [
                ...execFor('k', () => 0, (s) => s.vars.k < s.vars.adjList[s.vars.i].length, 1, [
                    ...execIfElse((s) => s.vars.adjList[s.vars.i][s.vars.k].getData() === s.vars.nodeTwo, [
                        { f(os) { const s = _.cloneDeep(os); s.vars.adjList[s.vars.i].splice(s.vars.k, 1); return s; } },
                    ])
                ])
            ])
        ])

    ]

    algos = [{
        name: 'Knoten hinzufügen',
        algo: {
          code: this.jsExampleInsertNode,
          lines: this.linesForInsertNode,
          breakpoints: [],
        },
        inputs: [
          {
            name: 'Daten',
            field: 'data',
            type: 'string',
            prefill: () => "E",
            validators: [{
              func: inputLength,
              param: {min: 1, max: lengthOfData}
            }]
          },
        ]
      },{
        name: 'Kante hinzufügen',
        algo: {
          code: this.jsExampleInsertEdge,
          lines: this.linesForInsertEdge,
          breakpoints: [],
        },
        inputs: [
        {
            name: 'Knoten 1 - ausgehender Knoten',
            field: 'nodeOne',
            type: 'string',
            validators: [{
                func: inputLength,
                param: {min: 1, max: lengthOfData}
            }]
            },{
            name: 'Knoten 2 - eingehender Knoten',
            field: 'nodeTwo',
            type: 'string',
            validators: [{
                func: inputLength,
                param: {min: 1, max: lengthOfData}
            }]
            },
        ]
      },{
        name: 'Kante löschen',
        algo: {
          code: this.jsExampleRemoveEdge,
          lines: this.linesForRemoveEdge,
          breakpoints: [],
        },
        inputs: [
        {
            name: 'Knoten 1 - ausgehender Knoten',
            field: 'nodeOne',
            type: 'string',
            validators: [{
                func: inputLength,
                param: {min: 1, max: lengthOfData}
            }]
            },{
            name: 'Knoten 2 - eingehender Knoten',
            field: 'nodeTwo',
            type: 'string',
            validators: [{
                func: inputLength,
                param: {min: 1, max: lengthOfData}
            }]
            },
        ]
      },]

    showOutput() {
    this.stateChangeCallback(
        this.exec.state.vars.adjList,
        this.exec.state.vars,
        this.exec.state.currentLine,
        this.exec.isRunning(),
    );
    }

    loadAlgoByIndex(index, inputs) {
        super.loadAlgoByIndex(index, {...inputs, adjList: this.exec.state.vars.adjList})
      }
}