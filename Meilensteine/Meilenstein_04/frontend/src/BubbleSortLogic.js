import * as _ from 'lodash';
import { execFor, execIfElse } from './AlgoExecuter';
import Logic from './Logic';
import { arrayEveryEntry, minMax, notEmpty } from './inputValidators';

// Klasse für den BubbleSort
export default class BubbleSort extends Logic {
  #stateChangeCallback;

  // Konstruktor
  constructor(eventReporter, stateChangeCallback) {
    super(eventReporter);
    this.#stateChangeCallback = stateChangeCallback;
    this.exec.changeAlgo(
      this.linesForBubbleSort,
      [8],
      10,
      { arr: [50, 35, 40, 15, 30, 45, 5, 20, 25, 10] },
    );
    this.exec.outputFunction = () => {
      this.#stateChangeCallback(
        this.exec.state.vars.arr,
        this.exec.state.vars,
        this.exec.state.currentLine,
        this.exec.isRunning(),
      );
    };
    this.exec.outputFunction();
  }

  // Algorithmus, der schrittweise ausgeführt wird
  linesForBubbleSort = [
    { f(os) { const s = _.cloneDeep(os); s.vars.temp = 0; return s; } },
    { f(os) { const s = _.cloneDeep(os); s.vars.n = s.vars.arr.length; return s; } },
    ...execFor(
      'i',
      () => 0,
      (s) => s.vars.i < s.vars.n - 1,
      1,
      execFor(
        'k',
        () => 0,
        (s) => s.vars.k < s.vars.n - 1 - s.vars.i,
        1,
        execIfElse((s) => s.vars.arr[s.vars.k] > s.vars.arr[s.vars.k + 1], [
          { f(os) { const s = _.cloneDeep(os); s.vars.temp = s.vars.arr[s.vars.k]; return s; } },
          {
            f(os) {
              const s = _.cloneDeep(os);
              s.vars.arr[s.vars.k] = s.vars.arr[s.vars.k + 1];
              return s;
            },
          },
          {
            f(os) {
              const s = _.cloneDeep(os);
              s.vars.arr[s.vars.k + 1] = s.vars.temp;
              return s;
            },
          },
        ]),
      ),
    ),
  ];

  jsCodeExampleLines = [
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
    '}'];

  algos = [
    {
      name: 'Sortieren',
      algo: {
        code: this.jsCodeExampleLines,
        lines: this.linesForBubbleSort,
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
            param: { min: 0 },
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
    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * 50) + 1; // Zufallszahlen zwischen 1 und 50
      this.exec.state.vars.arr.push(randomNumber);
    }
    this.showOutput();
  }

  // Funktion zum Einlesen der eigenen Werte
  editArray(integerArray) {
    this.exec.state.vars.arr = integerArray;
    this.exec.outputFunction();
  }

  // Funktion, die Array leert
  // eher unwichtig
  /* clearArray() {
    this.exec.state.vars.arr = [];
    this.exec.outputFunction();
  } */

  // Funktion, um das Array auszugeben
  showOutput() {
    this.#stateChangeCallback(
      this.exec.state.vars.arr,
      this.exec.state.vars,
      this.exec.state.currentLine,
      this.exec.isRunning(),
    );
  }
}
