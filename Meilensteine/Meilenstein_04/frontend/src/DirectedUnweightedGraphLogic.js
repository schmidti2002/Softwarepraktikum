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
    return {adjList: [[nodeA, nodeB],[nodeB, nodeC, nodeD],[nodeC,nodeA],[nodeD]], output: null};
  }
  
  // public boolean insertNode(String data) {
  exampleInsertNode = {
    java: [
    'if (adjList == null) {',
    '   adjList = new LinkedList<>();',
    '   adjList.add(new LinkedList<>());',
    '   adjList.get(0).add(new Node(data));',
    '   return true;',
    '}',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   if (adjList.get(i).get(0).getData().equals(data)) {',
    '       System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Knoten ist schon im Graphen");',
    '       return false;',
    '   }',
    '}',
    'adjList.add(adjList.size(), new LinkedList<>());',
    'adjList.get(adjList.size() - 1).add(new Node(data));',
    'return true;',
  ],
  javascript: [
    'if (this.adjList === null) {',
    '  this.adjList = [[]];',
    '  this.adjList[0].push(new Node(data));',
      'return true;',
    '}',
    'for (let i = 0; i < this.adjList.length; i++) {',
    '   if (this.adjList[i][0].getData() === data) {',
    '       console.error("Knoten ist schon im Graphen");',
    '       return false;',
    '   }',
    '}',
    'this.adjList.push([]);',
    'this.adjList[this.adjList.length - 1].push(new Node(data));',
    'return true;',
    ]}

  linesForInsertNode = [
    ...execIfElse((s) => s.vars.adjList === null, [
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList = [[]]; return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList[0].push(new Node(s.vars.data)); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
    ],[
        ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
            ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.data, [
              { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Knoten ist schon im Graphen'); return s; } },
              { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
            ]),]),
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList.push([]); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList[s.vars.adjList.length-1].push(new Node(s.vars.data)); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
    ]),
  ]

  // public boolean insertEdge(String nodeOne, String nodeTwo) {
  exampleInsertEdge = {
    java: [
    'if (adjList == null) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Graph ist leer");',
    '   return false;',
    '}',
    'int indexNodeOne = -1, indexNodeTwo = -1;',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   if (adjList.get(i).get(0).getData().equals(nodeOne)) {',
    '       indexNodeOne = i;',
    '   }',
    '   if (adjList.get(i).get(0).getData().equals(nodeTwo)) {',
    '       indexNodeTwo = i;',
    '   }',
    '}',
    'for (int i = 1; i < adjList.get(indexNodeOne).size(); i++) {',
    '   if (adjList.get(indexNodeOne).get(i).getData().equals(nodeTwo)) {',
    '       indexNodeTwo = -2;',
    '   }',
    '}',
    'if (indexNodeOne == -1 || indexNodeTwo == -1) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Kante ist nicht im Graph");',
    '   return false;',
    '}',
    'if (indexNodeTwo == -2) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Kante ist schon im Graph");',
    '   return false;',
    '}',
    'adjList.get(indexNodeOne).add(adjList.get(indexNodeTwo).get(0));',
    'return true;',
  ],
  javascript: [   
    'if (!adjList) {',
    '   console.error("Graph ist leer");',
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
    '   console.error("Kante ist nicht im Graph");',
    '   return false;',
    '}',
    'if (indexNodeTwo === -2) {',
    '   console.error("Kante ist schon im Graph");',
    '   return false;',
    '}',
    'adjList[indexNodeOne].push(adjList[indexNodeTwo][0]);',
    'return true;',
  ]}

  linesForInsertEdge = [
    ...execIfElse((s) => !s.vars.adjList, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Graph ist leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
      { f(os) { const s = _.cloneDeep(os); s.vars.indexNodeOne = -1; s.vars.indexNodeTwo = -1; return s; } },
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
          ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.nodeOne, [
              { f(os) { const s = _.cloneDeep(os); s.vars.indexNodeOne = s.vars.i; return s; } },
          ]),
          ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.nodeTwo, [
              { f(os) { const s = _.cloneDeep(os); s.vars.indexNodeTwo = s.vars.i; return s; } },
          ]),
      ]),
      ...execIfElse((s) => s.vars.indexNodeOne === -1 || s.vars.indexNodeTwo === -1, [
        { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Kante ist nicht im Graph'); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
      ]),
      ...execIfElse((s) => s.vars.indexNodeTwo === -2, [
        { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Kante ist schon im Graph'); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
      ]),
        { f(os) { const s = _.cloneDeep(os); s.vars.adjList[s.vars.indexNodeOne].push(s.vars.adjList[s.vars.indexNodeTwo][0]); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },        
    ]),
  ]

  // public List<Node> getEdgesOfNode(String data) {
  exampleGetEdgesOfNode = {
    java: [
    'if (adjList == null) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Graph ist leer");',
    '   return null;',
    '}',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   if (adjList.get(i).get(0).getData().equals(data)) {',
    '       return adjList.get(i).subList(0, 1);',
    '   }',
    '}',
    'System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Knoten nicht im Graph");',
    'return null;',
  ],
  javascript: [
    'if (!adjList) {',
    '   console.error("Exception: Graph ist leer");',
    '   return null;',
    '}',
    'for (let i = 0; i < adjList.length; i++) {',
    '   if (adjList[i][0].getData() === data) {',
    '       return adjList[i].splice(0, 1);',
    '   }',
    '}',
    'console.error("Exception: Knoten nicht im Graph");',
    'return null;',
    '}',
  ]}

  linesForGetEdgesOfNode = [
    ...execIfElse((s) => !s.vars.adjList, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Graph ist leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = null; return s; } },
    ],[
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
        ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.data, [
          { f(os) { const s = _.cloneDeep(os); s.vars.output = _.cloneDeep(s.vars.adjList[s.vars.i]).splice(1, s.vars.adjList[s.vars.i].length); s.currentLine = 'return'; return s; } },
        ]),
      ]),      
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Knoten nicht im Graph'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = null; return s; } },
    ]),
    {l: 'return'},
  ]

  // public boolean removeEdge(String nodeOne, String nodeTwo) {
  exampleRemoveEdge = {
    java: [
    'if (adjList == null) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Graph ist leer");',
    '   return false;',
    '}',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   if (adjList.get(i).get(0).getData().equals(nodeOne)) {',
    '       for (int k = 0; k < adjList.get(i).size(); k++) {',
    '           if (adjList.get(i).get(k).getData().equals(nodeTwo)) {',
    '               adjList.get(i).remove(k);',
    '               return true;',
    '           }',
    '       }',
    '       System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Kante nicht im Graphen");',
    '       return false;',
    '   }',
    '}',
    'System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Knoten nicht im Graphen");',
    'return false;',
  ],
  javascript: [
  'if (!adjList) {',
  '   console.error("Graph ist leer");',
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
  '       console.error("Kante nicht im Graphen");',
  '       return false;',
  '   }',
  '}',
  'console.error("Knoten nicht im Graphen");',
  'return false;',
  ]}

  linesForRemoveEdge = [
    ...execIfElse((s) => !s.vars.adjList, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Graph ist leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
          ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.nodeOne, [
              ...execFor('k', () => 0, (s) => s.vars.k < s.vars.adjList[s.vars.i].length, 1, [
                  ...execIfElse((s) => s.vars.adjList[s.vars.i][s.vars.k].getData() === s.vars.nodeTwo, [
                      { f(os) { const s = _.cloneDeep(os); s.vars.adjList[s.vars.i].splice(s.vars.k, 1); return s; } },
                      { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
                  ]),
              ]),
              { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Kante nicht im Graphen'); return s; } },
              { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
          ]),
      ]),
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Knoten nicht im Graphen'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ]),
  ]

  // public boolean removeNode(String data) {
  exampleRemoveNode = {
    java: [
    'if (adjList == null) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Graph ist leer");',
    '   return false;',
    '}',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   for (int k = 1; k < adjList.get(i).size(); k++) {',
    '       if (adjList.get(i).get(k).getData().equals(data)) {',
    '           adjList.get(i).remove(k);',
    '       }',
    '   }',
    '}',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   if (adjList.get(i).get(0).getData().equals(data)) {',
    '       adjList.remove(i);',
    '       return true;',
    '   }',
    '}',
    'System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Knoten nicht im Graphen");',
    'return false;',
  ],
  javascript: [
  'if (!adjList) {',
  '   console.error("Graph ist leer");',
  '   return false;',
  '}',
  'for (let i = 0; i < adjList.length; i++) {',
  '   for (let k = 1; k < adjList[i].length; k++) {',
  '       if (adjList[i][k].getData() === data) {',
  '           adjList[i].splice(k, 1);',
  '       }',
  '   }',
  '}',
  'for (let i = 0; i < adjList.length; i++) {',
  '   if (adjList[i][0].getData() === data) {',
  '       adjList.splice(i, 1);',
  '       return true;',
  '   }',
  '}',
  'console.error("Knoten nicht im Graphen");',
  'return false;',
  ]}

  linesForRemoveNode = [
    ...execIfElse((s) => !s.vars.adjList, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Graph ist leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
          ...execFor('k', () => 1, (s) => s.vars.k < s.vars.adjList[s.vars.i].length, 1, [
              ...execIfElse((s) => s.vars.adjList[s.vars.i][s.vars.k].getData() === s.vars.data, [
                  { f(os) { const s = _.cloneDeep(os); s.vars.adjList[s.vars.i].splice(s.vars.k, 1); return s; } },
              ]),
          ]),         
      ]),
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
          ...execIfElse((s) => s.vars.adjList[s.vars.i][0].getData() === s.vars.data, [
              { f(os) { const s = _.cloneDeep(os); s.vars.adjList.splice(s.vars.i, 1); return s; } },
              { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
          ]),                
      ]),        
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Knoten nicht im Graphen'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ]),
  ]

  // public boolean invert() {
  exampleInvert = {
    java: [
    'if (adjList == null) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Graph ist leer");',
    '   return false;',
    '}',
    'LinkedList<LinkedList<Node>> newAdjList = new LinkedList<>();',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   newAdjList.add(new LinkedList<>());',
    '   newAdjList.get(i).add(new Node(adjList.get(i).get(0).getData()));',
    '}',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   for (int k = 1; k < adjList.get(i).size(); k++) {',
    '       for (int p = 0; p < newAdjList.size(); p++) {',
    '           if (adjList.get(p).get(0).getData().equals(adjList.get(i).get(k).getData())) {',
    '               newAdjList.get(p).add(new Node(adjList.get(i).get(0).getData()));',
    '           }',
    '       }',
    '   }',
    '}',
    'this.deleteGraph();',
    'adjList = newAdjList;',
    'return true;',
  ],
  javascript: [
      'if (!adjList) {',
      ' console.error("Graph ist leer");',
      ' return false;',
      '}',
      'let newAdjList = [];',
      'for (let i = 0; i < adjList.length; i++) {',
      ' newAdjList.push([]);',
      ' newAdjList[i].push(new Node(adjList[i][0].getData()));',
      '}',
      'for (let i = 0; i < adjList.length; i++) {',
      ' for (let k = 1; k < adjList[i].length; k++) {',
      '   for (let p = 0; p < newAdjList.length; p++) {',
      '     if (adjList[p][0].getData() === adjList[i][k].getData()) {',
      '     newAdjList[p].push(new Node(adjList[i][0].getData()));',
      '     }',
      '   }',
      ' }',
      '}',
      'this.deleteGraph();',
      'adjList = newAdjList;',
      'return true;',
  ]}

  linesForInvert = [
    ...execIfElse((s) => !s.vars.adjList, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Graph ist leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
      { f(os) { const s = _.cloneDeep(os); s.vars.newAdjList = []; return s; } },
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
        { f(os) { const s = _.cloneDeep(os); s.vars.newAdjList.push([]); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.newAdjList[s.vars.i].push(new Node(s.vars.adjList[s.vars.i][0].getData())); return s; } },
      ]),
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
        ...execFor('k', () => 1, (s) => s.vars.k < s.vars.adjList[s.vars.i].length, 1, [
          ...execFor('p', () => 0, (s) => s.vars.p < s.vars.newAdjList.length, 1, [
            ...execIfElse((s) => s.vars.adjList[s.vars.p][0].getData() === s.vars.adjList[s.vars.i][s.vars.k].getData(), [
              { f(os) { const s = _.cloneDeep(os); s.vars.newAdjList[s.vars.p].push(new Node(s.vars.adjList[s.vars.i][0].getData())); return s; } },
            ]),
        ]),
      ]),
    ]),
    { f(os) { const s = _.cloneDeep(os); s.vars.adjList = undefined; return s; } },
    { f(os) { const s = _.cloneDeep(os); s.vars.adjList = s.vars.newAdjList; return s; } },
    { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
    ]),
  ]

  // public void deleteGraph() {
  exampleDeleteGraph = {
    java: [
    'if (adjList == null) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Graph ist schon leer");',
    '   return false;',
    '}',
    'for (int i = 0; i < adjList.size(); i++) {',
    '   adjList.get(i).clear();',
    '}',
    'adjList.clear();',
    'return true'
  ],
  javascript: [
  'if (!adjList) {',
      ' console.error("Graph ist schon leer");',
      ' return false;',
  '}',
  'for (let i = 0; i < adjList.length; i++) {',
  '   adjList[i].splice(0, adjList[i].length);',
  '}',
  'adjList.splice(0, adjList.length);',
  'return true;',
  ]}

  linesForDeleteGraph = [
    ...execIfElse((s) => !s.vars.adjList, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Graph ist schon leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
    ...execFor('i', () => 0, (s) => s.vars.i < s.vars.adjList.length, 1, [
      { f(os) { const s = _.cloneDeep(os); s.vars.newAdjList[s.vars.i].splice(0, s.vars.adjList[s.vars.i].length); return s; } },
    ]),
    { f(os) { const s = _.cloneDeep(os); s.vars.newAdjList.splice(0, s.vars.adjList.length); return s; } },
    { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
  ])
  ]

    algos = [{
        name: 'Knoten hinzufügen',
        algo: {
          code: this.exampleInsertNode,
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
          code: this.exampleInsertEdge,
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
        name: 'Kanten von Knoten finden',
        algo: {
          code: this.exampleGetEdgesOfNode,
          lines: this.linesForGetEdgesOfNode,
          breakpoints: [],
        },
        inputs: [
        {
            name: 'Knoten',
            field: 'data',
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
          code: this.exampleRemoveEdge,
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
      },{
        name: 'Knoten löschen',
        algo: {
          code: this.exampleRemoveNode,
          lines: this.linesForRemoveNode,
          breakpoints: [],
        },
        inputs: [
        {
            name: 'Knoten',
            field: 'data',
            type: 'string',
            validators: [{
                func: inputLength,
                param: {min: 1, max: lengthOfData}
            }]
            },
        ]
      },{
        name: 'Graphen invertieren',
        algo: {
          code: this.exampleInvert,
          lines: this.linesForInvert,
          breakpoints: [],
        },
        inputs: []
      },{
        name: 'Graphen löschen',
        algo: {
          code: this.exampleDeleteGraph,
          lines: this.linesForDeleteGraph,
          breakpoints: [],
        },
        inputs: []
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
        super.loadAlgoByIndex(index, {...inputs, adjList: this.exec.state.vars.adjList, output: null})
      }
}