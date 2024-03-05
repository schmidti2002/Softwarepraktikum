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
    this.next = null;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }

  getNext() {
    return this.next;
  }

  setNext(next) {
    this.next = next;
  }
}

// Klasse der SingleLinkedList
export default class SingleLinkedList extends Logic {
  // Konstruktor um SingleLinkedList mit Standardwerten zu laden
  constructor(eventReporter, stateChangeCallback) {
    super(eventReporter, stateChangeCallback);
    this.exec.changeAlgo(
      this.linesForAddDataAtPosition,
      [1],
      1,
      this.#initList(),
    );

    this.exec.outputFunction = () => {
      this.showOutput();
    };
    this.showOutput();
  }

  // Initialisierung der Liste mit Standardwerten
  #initList() {
    let node = new Node("A");
    node.setNext(new Node("B"));
    node.getNext().setNext(new Node("C"));
    return {front: node};
  }

  static getSize(front) {
    let size = 0;
    let currentNode = front;

    while (currentNode !== null) {
      currentNode = currentNode.getNext();
      size++;
    }

    return size;
  }

  // public boolean addDataAtPosition(int position, String data) {
  exampleAddDataAtPosition = {
    java: [
    'if (position < 0 || position > getSize()) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: Position ist außerhalb der Liste");',
    '   return false;',
    '}',
    'Node newNode = new Node(data);',
    'if (position === 0) {',
    '   newNode.setNext(front);',
    '   front = newNode;',
    '   return true;',
    '}',
    'Node currentNode = front;',
    'for (int currentIndex = 1; currentIndex < position; currentIndex++) {',
    '   currentNode = currentNode.getNext();',
    '}',
    'newNode.setNext(currentNode.getNext());',
    'currentNode.setNext(newNode);',
    'return true;',
  ],
  javascript: [
    'if (position < 0 || position >= getSize()) {',
    '   console.error("Position ist außerhalb der Liste");',
    '   return false;',
    '}',
    'let newNode = new Node(data);',
    'if (position === 0) {',
    '   newNode.setNext(front);',
    '   front = newNode;',
    '   return true;',
    'let currentNode = front;',
    'for (let currentIndex = 1; currentIndex < position; currentIndex++) {',
    '   currentNode = currentNode.getNext();',
    '}',
    'newNode.setNext(currentNode.getNext());',
    'currentNode.setNext(newNode);',
    'return true;',
  ]}

  linesForAddDataAtPosition = [
    ...execIfElse((s) => s.vars.position < 0 || s.vars.position >= SingleLinkedList.getSize(s.vars.front), [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Position ist außerhalb der Liste'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
      { f(os) { const s = _.cloneDeep(os); s.vars.newNode = new Node(s.vars.data); return s; } },
      ...execIfElse((s) => s.vars.position === 0, [
        { f(os) { const s = _.cloneDeep(os); s.vars.newNode.setNext(s.vars.front); return s; } },
        { f(os) {const s = _.cloneDeep(os); s.vars.front = s.vars.newNode; return s; }, },
        { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
      ], [
        { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
        ...execFor('i', () => 1, (s) => s.vars.i < s.vars.position, 1, [
          {f(os) {const s = _.cloneDeep(os); s.vars.currentNode = s.vars.currentNode.getNext();return s; },},
        ]),
        {f(os) {const s = _.cloneDeep(os); s.vars.newNode.setNext(s.vars.currentNode.getNext()); return s; },},
        {f(os) {const s = _.cloneDeep(os);s.vars.currentNode.setNext(s.vars.newNode); return s; }, },
        {f(os) { const s = _.cloneDeep(os);s.vars.output = true; return s;},}
      ]),
    ]),
  ];

  // public String getDataAtPosition(int position) {
  exampleGetDataAtPositon = {
    java: [
    'if (position < 0 || position >= getSize()) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: Position ist außerhalb der Liste");',
    '   return null;',
    '}',
    'Node currentNode = front;',
    'for (int currentIndex = 0; currentIndex < position; currentIndex++) {',
    '   currentNode = currentNode.getNext();',
    '}',
    'return currentNode.getData();',
  ],
  javascript: [
    'if (position < 0 || position >= getSize()) {',
    '   console.error("Position ist außerhalb der Liste");',
    '   return null;',
    '}',
    'let currentNode = front;',
    'for (let currentIndex = 0; currentIndex < position; currentIndex++) {',
    '   currentNode = currentNode.getNext();',
    '}',
    'return currentNode.getData();',
  ]}

  linesForGetDataAtPosition = [
    ...execIfElse((s) => s.vars.position < 0 || s.vars.position >= SingleLinkedList.getSize(s.vars.front), [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Position ist außerhalb der Liste'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = null; return s; } },
    ],[
      { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.position, 1, [
        {f(os) {const s = _.cloneDeep(os); s.vars.currentNode = s.vars.currentNode.getNext(); return s; },},
      ]),
      { f(os) {const s = _.cloneDeep(os); s.vars.output = s.vars.currentNode.getData();return s;},},
    ]),
  ]

  // public int getPositionOfData(String data) {
  exampleGetPositionOfData = {
    java: [
    'if (front === null) {',
    '  System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Liste ist leer");',
    '  return -1;',
    '}',
    'Node currentNode = front;',
    'for (int position = 0; position < getSize(); position++) {',
    '  if (currentNode.getData().equals(data)) {',
    '    return position;',
    '  }',
    '  currentNode = currentNode.getNext();',
    '}',
    'System.err.println("Exeption in thread \"main\" java.lang.IOExeption: Daten sind nicht in der Liste");',
    'return -1;',
  ],
  javascript: [
    'if (front === null) {',
    '   console.error("Liste ist leer");',
    '   return -1;',
    '}',
    'let currentNode = front;',
    'for (let position = 0; position < getSize(); position++) {',
    '   if (currentNode.getData() === data) {',
    '       return position;',
    '   }',
    '   currentNode = currentNode.getNext();',
    '}',
    'console.error("Daten sind nicht in der Liste");',
    'return -1;',
  ]}

  linesForGetPositionOfData = [
    ...execIfElse((s) => s.vars.front === null, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Liste ist leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = -1; return s; } },
    ],[
      { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
      ...execFor('pos', () => 0, (s) => s.vars.pos < SingleLinkedList.getSize(s.vars.front), 1, [
        ...execIfElse((s) => s.vars.currentNode.getData() === s.vars.data, [
          { f(os) { const s = _.cloneDeep(os); s.vars.output = s.vars.pos; s.currentLine = 'return'; return s; } },
        ]),
        {f(os) {const s = _.cloneDeep(os);s.vars.currentNode = s.vars.currentNode.getNext(); return s; },  },
      ]),
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Daten sind nicht in der Liste'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = -1; return s; } },
    ]),
    {l: 'return'},
  ];

  // public boolean removeDataAtPosition(int position) {
  exampleRemoveDataAtPosition = {
    java: [
    'if (position < 0 || position >= getSize()) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: Position ist außerhalb der Liste");',
    '   return false;',
    '}',
    'if (position === 0) {',
    '   front = front.getNext();',
    '   return true;',
    '}',
    'Node currentNode = front;',
    'for (int currentIndex = 1; currentIndex < position; currentIndex++) {',
    '   currentNode = currentNode.getNext();',
    '}',
    'currentNode.setNext(currentNode.getNext().getNext());',
    'return true;',
  ],
  javascript: [
    'if (position < 0 || position >= getSize()) {',
    '   console.error("Position ist außerhalb der Liste");',
    '   return false;',
    '}',
    'if (position === 0) {',
    '   front = front.getNext();',
    '   return true;',
    '}',
    'let currentNode = front;',
    'for (let currentIndex = 1; currentIndex < position; currentIndex++) {',
    '   currentNode = currentNode.getNext();',
    '}',
    'currentNode.setNext(currentNode.getNext().getNext());',
    'return true;',
  ]}

  linesForRemoveDataAtPosition = [
    ...execIfElse((s) => s.vars.position < 0 || s.vars.position >= SingleLinkedList.getSize(s.vars.front), [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Position ist außerhalb der Liste'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
      ...execIfElse((s) => s.vars.position === 0, [
        { f(os) { const s = _.cloneDeep(os); s.vars.front = s.vars.front.getNext(); return s; } },
        { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
      ], [
        { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
        ...execFor('i', () => 1, (s) => s.vars.i < s.vars.position, 1, [
          {f(os) {const s = _.cloneDeep(os); s.vars.currentNode = s.vars.currentNode.getNext();return s; },},
        ]),
        {f(os) {const s = _.cloneDeep(os);s.vars.currentNode.setNext(s.vars.currentNode.getNext().getNext());return s; },},
        { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
      ]),
    ]),
  ];

  // public boolean invertList() {
  exampleInverList = {
    java: [
    'if (front === null) {',
    '   System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: Liste ist leer");',
    '   return false;',
    '}',
    'Node newFront = front;',
    'int size = getSize() - 1;',
    'for (int i = 0; i < size; i++) {',
    '   newFront = newFront.getNext();',
    '}',
    'Node currentNode;',
    'for (int j = 0; j < size; j++) {',
    '   currentNode = front;',
    '   for (int k = 0; k < size - 1 - j; k++) {',
    '       currentNode = currentNode.getNext();',
    '   }',
    '   currentNode.getNext().setNext(currentNode);',
    '}',
    'front.setNext(null);',
    'front = newFront;',
    'return true;',
  ],
  javascript: [
    'if (front === null) {',
    '   console.error("Liste ist leer");',
    '   return false;',
    '}',
    'let newFront = front;',
    'let size = getSize() - 1;',
    'for (let i = 0; i < size; i++) {',
    '   newFront = newFront.getNext();',
    '}',
    'let currentNode;',
    'for (let j = 0; j < size; j++) {',
    '   currentNode = front;',
    '   for (let k = 0; k < size - 1 - j; k++) {',
    '       currentNode = currentNode.getNext();',
    '   }',
    '   currentNode.getNext().setNext(currentNode);',
    '}',
    'front.setNext(null);',
    'front = newFront;',
    'return true;',
  ]}

  // Visualisierung bricht am Breakpoint, muss man sich sowieso nochmal genauer anschauen
  linesForInvertList = [
    ...execIfElse((s) => s.vars.front === null, [
      { f(os, eventReporter) { const s = _.cloneDeep(os); eventReporter.info('Liste ist leer'); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = false; return s; } },
    ],[
      { f(os) { const s = _.cloneDeep(os); s.vars.newFront = s.vars.front; return s; } },
      { f(os) {const s = _.cloneDeep(os); s.vars.size = SingleLinkedList.getSize(s.vars.front) - 1; return s; }, },
      ...execFor('i', () => 0, (s) => s.vars.i < s.vars.size, 1, [
        { f(os) { const s = _.cloneDeep(os); s.vars.newFront = s.vars.newFront.getNext(); return s; }, },
      ]),
      { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = undefined; return s; } },
      ...execFor('j', () => 0, (s) => s.vars.j < s.vars.size, 1, [
        { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
        ...execFor('k', () => 0, (s) => s.vars.k < s.vars.size - 1 - s.vars.j, 1, [
          {f(os) { const s = _.cloneDeep(os);s.vars.currentNode = s.vars.currentNode.getNext(); return s; }, }, // Breakpoint
        ]),
        { f(os) {const s = _.cloneDeep(os);s.vars.currentNode.getNext().setNext(s.vars.currentNode); return s; },},
      ]),
      { f(os) { const s = _.cloneDeep(os); s.vars.front.setNext(null); return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.front = s.vars.newFront; return s; } },
      { f(os) { const s = _.cloneDeep(os); s.vars.output = true; return s; } },
    ]),
  ];

  // public void deleteList() {
  exampleDeleteList = {
    java: [
    'this.front = null;',
  ],
  javascript: [
    'this.front = null;'
  ]}

  linesForDeleteList = [
    { f(os) { const s = _.cloneDeep(os); s.vars.front = null; return s; } },
  ];

  algos = [
    {
      name: 'Daten an Position hinzufügen',
      algo: {
        code: this.exampleAddDataAtPosition,
        lines: this.linesForAddDataAtPosition,
        breakpoints: [],
      },
      inputs: [
        {
          name: 'Daten',
          field: 'data',
          type: 'string',
          prefill: () => "D",
          validators: [{
            func: inputLength,
            param: {min: 1, max: lengthOfData}
          }]
        },{
          name: 'Position',
          field: 'position',
          type: 'integer',
          prefill: () => "0",
          validators: [{
            func: minMax,
            param: {min: 0},
          }]
        }
      ]
    },
    {
      name: 'Daten von Position zurückgeben',
      algo: {
        code: this.exampleGetDataAtPosition,
        lines: this.linesForGetDataAtPosition,
        breakpoints: [],
      },
      inputs: [{
        name: 'Position',
          field: 'position',
          type: 'integer',
          validators: [{
            func: minMax,
            param: {min: 0},
          }]
      }]
    },{
      name: 'Position von Daten zurückgeben',
      algo: {
        code: this.exampeGetPositionOfData,
        lines: this.linesForGetPositionOfData,
        breakpoints: [],
      },
      inputs: [{
        name: 'Daten',
          field: 'data',
          type: 'string',
          validators: [{
            func: inputLength,
            param: {min: 1, max: lengthOfData}
          }]
      }]
    },{
      name: 'Daten an Position löschen',
      algo: {
        code: this.exampleRemoveDataAtPostion,
        lines: this.linesForRemoveDataAtPosition,
        breakpoints: [],
      },
      inputs: [{
        name: 'Position',
          field: 'position',
          type: 'integer',
          validators: [{
            func: inputLength,
            param: {min: 1, max: lengthOfData}
          }]
      }]
    },{
      name: 'Liste invertieren',
      algo: {
        code: this.exampleInvertList,
        lines: this.linesForInvertList,
        breakpoints: [],
      },
      inputs: []
    },{
      name: 'Liste löschen',
      algo: {
        code: this.exampleDeleteList,
        lines: this.linesForDeleteList,
        breakpoints: [],
      },
      inputs: []
    }
  ]

  showOutput() {
    this.stateChangeCallback(
      this.exec.state.vars.front,
      this.exec.state.vars,
      this.exec.state.currentLine,
      this.exec.isRunning(),
    );
  }

  loadAlgoByIndex(index, inputs) {
    super.loadAlgoByIndex(index, {...inputs, front: this.exec.state.vars.front, output: null})
  }
}