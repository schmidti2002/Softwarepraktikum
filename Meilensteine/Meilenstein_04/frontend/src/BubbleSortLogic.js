import * as _ from 'lodash';
import { execFor, execIfElse } from './AlgoExecuter';
import Logic from './Logic';
import { arrayEveryEntry, minMax, notEmpty } from './inputValidators';

// Klasse für die Logik von BubbleSort
export default class BubbleSort extends Logic {
  // Konstruktor
  constructor(eventReporter, stateChangeCallback) {
    super(eventReporter, stateChangeCallback);
    this.exec.changeAlgo(
      this.linesForBubbleSort,
      [8],
      10,
      { arr: [50, 35, 40, 15, 30, 45, 5, 20, 25, 10] },   // Standardwerte
    );
    this.exec.outputFunction = () => {
      this.showOutput();
    };
    this.showOutput(); // Werte initial anzeigen
  }

  // public static int[] bubbleSort(int[] arr) {
  // Der Code für das Sortieren, welcher in der CodeView angezeigt werden soll
  exampleSort = { 
    java: [
    'int temp;',
    'for (int i = 0; i < arr.length - 1; i++) {',
    '   for (int k = 0; k < arr.length - 1 - i; k++) {',
    '       if (arr[k] > arr[k + 1]) {',
    '           temp = arr[k];',
    '           arr[k] = arr[k + 1];',
    '           arr[k + 1] = temp;',
    '       }',
    '   }',
    '}',
    'return arr;',
  ],
  javascript: [
    'let temp;',
    'const n = arr.length;',
    'for (let i = 0; i < n - 1; i++) {',
    '    for (let k = 0; k < n - 1 - i; k++) {',
    '        if (arr[k] > arr[k + 1]) {',
    '            temp = arr[k];',
    '            arr[k] = arr[k + 1];',
    '            arr[k + 1] = temp;',
    '        }',
    '    }',
    '}',
  ],}

  // Algorithmus, der schrittweise ausgeführt wird
  linesForSort = [
    { f(os) { const s = _.cloneDeep(os); s.vars.temp = 0; return s; } },
    { f(os) { const s = _.cloneDeep(os); s.vars.n = s.vars.arr.length; return s; } },
    ...execFor('i', () => 0,(s) => s.vars.i < s.vars.n - 1, 1, [
     ...execFor('k',() => 0,(s) => s.vars.k < s.vars.n - 1 - s.vars.i, 1, [
       ...execIfElse((s) => s.vars.arr[s.vars.k] > s.vars.arr[s.vars.k + 1], [
          { f(os) { const s = _.cloneDeep(os); s.vars.temp = s.vars.arr[s.vars.k]; return s; } },
          { f(os) { const s = _.cloneDeep(os); s.vars.arr[s.vars.k] = s.vars.arr[s.vars.k + 1];  return s; }, },
          { f(os) { const s = _.cloneDeep(os); s.vars.arr[s.vars.k + 1] = s.vars.temp; return s; }, },
        ]),
      ]),
    ]),
  ];  

  // Die Algorithmen von BubbleSort, werden in AuDView.js geladen
  algos = [
    {
      name: 'Sortieren',
      algo: {
        code: this.exampleSort,
        lines: this.linesForSort,
        breakpoints: [8],
      },
      inputs: [
        {
          name: 'Werte',
          field: 'arr',
          type: 'integer[]',
          prefill: () => _.join(this.exec.state.vars.arr),
          validators: [{
            func: arrayEveryEntry(minMax),
            param: { min: 0 },
          },
          {
            func: arrayEveryEntry(notEmpty),
          },
          ],
        },
      ],
    },
    {
      name: 'Neue Werte',
      func: (inputs) => this.generateRandomNumbers(inputs.count),
      inputs: [
        {
          name: 'Anzahl',
          field: 'count',
          type: 'integer',
          validators: [{
            func: minMax,
            param: { min: 0, max: 200 },
          },
          {
            func: notEmpty,
          },
          ],
        },
      ],
    },
    {
      name: 'Werte bearbeiten',
      func: (inputs) => this.editArray(inputs.arr),
      inputs: [
        {
          name: 'Werte',
          field: 'arr',
          type: 'integer[]',
          prefill: () => _.join(this.exec.state.vars.arr),
          validators: [{
            func: arrayEveryEntry(minMax),
            param: { min: 0 },
          },
          {
            func: arrayEveryEntry(notEmpty),
          },
          ],
        },
      ],
    },
    /* {
      // Eher unwichtig
      name: 'Array leeren',
      func: () => this.clearArray(),
      inputs: [
        {
          name: 'Werte',
          field: 'arr',
          type: 'integer[]',
          prefill: () => _.join(this.exec.state.vars.arr),
          validators: [
            {
              func: arrayEveryEntry(minMax),
              param: { min: 0 },
            },
            {
              func: arrayEveryEntry(notEmpty),
            },
          ],
        },
      ],
    }, */
  ];

  // Funktion, um n Zufallszahlen zu generieren
  generateRandomNumbers(count) {
    // Zufallszahlen initialisieren und anzeigen
    this.exec.state.vars.arr = [];
    for (let i = 0; i < Math.min(count, 200); i++) {
      const randomNumber = Math.floor(Math.random() * 50) + 1; // Zufallszahlen zwischen 1 und 50
      this.exec.state.vars.arr.push(randomNumber);
    }
    this.showOutput();
  }

  // Funktion zum Einlesen der eigenen Werte
  editArray(integerArray) {
    this.exec.state.vars.arr = integerArray;
    this.showOutput();
  }

  // Funktion, die Array leert
  // eher unwichtig
  /* clearArray() {
    this.exec.state.vars.arr = [];
    this.exec.outputFunction();
  } */

  // Funktion, um das Array auszugeben
  showOutput() {
    this.stateChangeCallback(
      this.exec.state.vars.arr,
      this.exec.state.vars,
      this.exec.state.currentLine,
      this.exec.isRunning(),
    );
  }
}
