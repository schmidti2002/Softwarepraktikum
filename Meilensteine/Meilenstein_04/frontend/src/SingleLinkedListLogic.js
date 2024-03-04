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
    this.showOutput();
  }

  // Initialisierung der Liste mit Standardwerten
  #initList() {
    let node = new Node("A");
    node.setNext(new Node("B"));
    node.getNext().setNext(new Node("C"));
    return {front: node};
  }

  /* public boolean addDataAtPosition(int position, String data) {
        if (position < 0 || position > getSize()) {
            System.err.println(
                "Exeption in thread \"main\""
                + "java.lang.ListIndexOutOfBounceExeption: position is out of list");
            return false;
        }
        Node newNode = new Node(data);
        if (position === 0) {
            newNode.setNext(front);
            front = newNode;
            return true;
        }
        Node currentNode = front;
        for (int currentIndex = 1; currentIndex < position; currentIndex++) {
            currentNode = currentNode.getNext();
        }
        newNode.setNext(currentNode.getNext());
        currentNode.setNext(newNode);
        return true;
  }  */

  jsExampleAddDataAtPosition = [
    'let newNode = new Node(data);',
    'if (position === 0) {',
    '   newNode.setNext(front);',
    '   front = newNode;',
    '   return true; //gibt es nicht',
    'let currentNode = front;',
    'for (let currentIndex = 1; currentIndex < position; currentIndex++) {',
    '   currentNode = currentNode.getNext();',
    '}',
    'newNode.setNext(currentNode.getNext());',
    'currentNode.setNext(newNode);',
    'return true; // gibt es auch nicht',
  ];

  linesForAddDataAtPosition = [
    // if (position < 0 || position > this.getSize(this.front)) {
    //    console.error("Exception: position is out of list");
    //    return false;
    // }
    { f(os) { const s = _.cloneDeep(os); s.vars.newNode = new Node(s.vars.data); return s; } },
    ...execIfElse((s) => s.vars.position === 0, [
      { f(os) { const s = _.cloneDeep(os); s.vars.newNode.setNext(s.vars.front); return s; } },
      {
        f(os) { // Breakpoint
          const s = _.cloneDeep(os);
          s.vars.front = s.vars.newNode;
          return s;
        },
      },
    ], [
      { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
      ...execFor('i', () => 1, (s) => s.vars.i < s.vars.position, 1, [
        {
          f(os) {
            const s = _.cloneDeep(os);
            s.vars.currentNode = s.vars.currentNode.getNext();
            return s;
          },
        },
      ]),
      {
        f(os) {
          const s = _.cloneDeep(os);
          s.vars.newNode.setNext(s.vars.currentNode.getNext());
          return s;
        },
      },
      {
        f(os) { // Breakpoint
          const s = _.cloneDeep(os);
          s.vars.currentNode.setNext(s.vars.newNode);
          return s;
        },
      },
    ]),
  ];

  /* public String getDataAtPosition(int position) {
        if (position < 0 || position >= getSize()) {
            System.err.println(
                    "Exeption in thread \"main\""
                    + "java.lang.ListIndexOutOfBounceExeption: position is out of list");
            return null;
        }
        Node currentNode = front;
        for (int currentIndex = 0; currentIndex < position; currentIndex++) {
            currentNode = currentNode.getNext();
        }
        return currentNode.getData();
  } */

  linesForGetDataAtPosition = [
    { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
    ...execFor('i', () => 0, (s) => s.vars.i < s.vars.position, 1, [
      {
        f(os) {
          const s = _.cloneDeep(os);
          s.vars.currentNode = s.vars.currentNode.getNext();
          return s;
        },
      },
    ]),
    {
      f(os) {
        const s = _.cloneDeep(os);
        s.vars.dataFound = s.vars.currentNode.getData();
        return s;
      },
    },
  ];

  /* public int getPositionOfData(String data) {
    if (front === null) {
      System.err.println("Exeption in thread \"main\""
      +"java.lang.NullPointerExeption: list is empty");
      return -1;
    }
    Node currentNode = front;
    for (int position = 0; position < getSize(); position++) {
      if (currentNode.getData().equals(data)) {
        return position;
      }
      currentNode = currentNode.getNext();
    }
    System.err.println("Exeption in thread \"main\" java.lang.IOExeption: data not in list");
    return -1;
  } */

  linesForGetPositionOfData = [
    { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
    ...execFor('i', () => 0, (s) => s.vars.i < this.getSize(), 1, [
      ...execIfElse((s) => s.vars.currentNode.getData() === s.vars.data, [
        { f(os) { const s = _.cloneDeep(os); s.vars.positionFound = s.vars.i; return s; } },
        // Return-Statement noch hinzufügen
      ]),
      {
        f(os) {
          const s = _.cloneDeep(os);
          s.vars.currentNode = s.vars.currentNode.getNext();
          return s;
        },
      },
    ]),
  ];

  /* public boolean removeDataAtPosition(int position) {
    if (position < 0 || position >= getSize()) {
      System.err.println(
          "Exeption in thread \"main\""
          +"java.lang.ListIndexOutOfBounceExeption: position is out of list");
      return false;
    }
    if (position === 0) {
      front = front.getNext();
      return true;
    }
    Node currentNode = front;
    for (int currentIndex = 1; currentIndex < position; currentIndex++) {
      currentNode = currentNode.getNext();
    }
    currentNode.setNext(currentNode.getNext().getNext());
    return true;
  } */

  // Auch hier die Return-Statements noch hinzufügen
  linesForRemoveDataAtPosition = [
    ...execIfElse((s) => s.vars.position === 0, [
      { f(os) { const s = _.cloneDeep(os); s.vars.front = s.vars.front.getNext(); return s; } },
    ], [
      { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
      ...execFor('i', () => 1, (s) => s.vars.i < s.vars.position, 1, [
        {
          f(os) {
            const s = _.cloneDeep(os);
            s.vars.currentNode = s.vars.currentNode.getNext();
            return s;
          },
        },
      ]),
      {
        f(os) {
          const s = _.cloneDeep(os);
          s.vars.currentNode.setNext(s.vars.currentNode.getNext().getNext());
          return s;
        },
      },
    ]),
  ];

  /* public boolean invertList() {
    if (front === null) {
      System.err.println("Exeption in thread \"main\""
      +"java.lang.NullPointerExeption: list is empty");
      return false;
    }
    Node newFront = front;
    int size = getSize() - 1;
    for (int i = 0; i < size; i++) {
      newFront = newFront.getNext();
    }
    Node currentNode;
    for (int j = 0; j < size; j++) {
      currentNode = front;
      for (int k = 0; k < size - 1 - j; k++) {
        currentNode = currentNode.getNext();
      }
      currentNode.getNext().setNext(currentNode);
    }
    front.setNext(null);
    front = newFront;
    return true;
  } */

  // Visualisierung bricht am Breakpoint, muss man sich sowieso nochmal genauer anschauen
  linesForInvertList = [
    { f(os) { const s = _.cloneDeep(os); s.vars.newFront = s.vars.front; return s; } },
    {
      f(os) {
        const s = _.cloneDeep(os);
        s.vars.size = this.getSize(s.vars.front) - 1;
        return s;
      },
    },
    ...execFor('i', () => 0, (s) => s.vars.i < s.vars.size, 1, [
      {
        f(os) {
          const s = _.cloneDeep(os);
          s.vars.newFront = s.vars.newFront.getNext();
          return s;
        },
      },
    ]),
    { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = undefined; return s; } },
    ...execFor('j', () => 0, (s) => s.vars.j < s.vars.size, 1, [
      { f(os) { const s = _.cloneDeep(os); s.vars.currentNode = s.vars.front; return s; } },
      ...execFor('k', () => 0, (s) => s.vars.k < s.vars.size - 1 - s.vars.j, 1, [
        {
          f(os) { // Breakpoint
            const s = _.cloneDeep(os);
            s.vars.currentNode = s.vars.currentNode.getNext();
            return s;
          },
        },
      ]),
      {
        f(os) {
          const s = _.cloneDeep(os);
          s.vars.currentNode.getNext().setNext(s.vars.currentNode);
          return s;
        },
      },
    ]),
    { f(os) { const s = _.cloneDeep(os); s.vars.front.setNext(null); return s; } },
    { f(os) { const s = _.cloneDeep(os); s.vars.front = s.vars.newFront; return s; } },
  ];

  /* public void deleteList() {
    this.front = null;
  } */

  linesForDeleteList = [
    { f(os) { const s = _.cloneDeep(os); s.vars.front = null; return s; } },
  ];

  getSize() {
    let size = 0;
    let currentNode = this.exec.state.vars.front;

    while (currentNode !== null) {
      currentNode = currentNode.getNext();
      size++;
    }

    return size;
  }
  algos = [
    {
      name: 'Daten an Position hinzufügen',
      algo: {
        code: this.jsExampleAddDataAtPosition,
        lines: this.linesForAddDataAtPosition,
        breakpoints: [1],
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
        code: [],
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
      name: 'Position von Datan zurückgeben',
      algo: {
        code: [],
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
        code: [],
        lines: this.linesForRemoveDataAtPosition,
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
      name: 'Liste invertieren',
      algo: {
        code: [],
        lines: this.linesForInvertList,
        breakpoints: [],
      },
      inputs: []
    },{
      name: 'Liste löschen',
      algo: {
        code: [],
        lines: this.linesForDeleteList,
        breakpoints: [],
      },
      inputs: []
    }
  ]


  /*
  // Data und Position im Ausgabebereich ausgeben
  outputData() {
    // console.log(this.exec.state.vars.dataFound);
    document.getElementById('outputLine').innerHTML = 'Ausgabe-Bereich: '
      + `Daten ${this.exec.state.vars.dataFound}`
      + ` an Position ${this.exec.state.vars.position}`;
  }

  // Data und Position im Ausgabebereich ausgeben
  outputPosition() {
    document.getElementById('outputLine').innerHTML = 'Ausgabe-Bereich: '
      + `Daten ${this.exec.state.vars.data}`
      + ` an Position ${this.exec.state.vars.positionFound}`;
  }
*/

  showOutput() {
    this.stateChangeCallback(
      this.exec.state.vars.front,
      this.exec.state.vars,
      this.exec.state.currentLine,
      this.exec.isRunning(),
    );
  }
}