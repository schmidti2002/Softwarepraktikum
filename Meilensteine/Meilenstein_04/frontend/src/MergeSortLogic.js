import * as _ from 'lodash';
import { execFor, execIfElse } from './AlgoExecuter';
import Logic from './Logic';
import { arrayEveryEntry, minMax, notEmpty } from './inputValidators';

// Klasse für den MergeSort
export default class MergeSort extends Logic {
  // Konstruktor
  constructor(eventReporter, stateChangeCallback) {
    super(eventReporter, stateChangeCallback);
    this.exec.changeAlgo(
      this.linesForMergeSort,
      [21],
      10,
      { arr: [40, 28, 32, 12, 24, 36, 4, 16, 20, 18, 44, 48, 0, 50, 25, 8] },
    );
    this.exec.outputFunction = () => {
      this.showOutput();
    };
    this.showOutput();
  }

  linesForMergeSort = [
    // { f(os) { const s = _.cloneDeep(os); s.vars.arrOld = _.cloneDeep(s.vars.arr); return s; } },
    { f(os) { const s = _.cloneDeep(os); s.vars.n = s.vars.arr.length; return s; } },
    {
      f(os) {
        const s = _.cloneDeep(os);
        s.vars.aux = new Array(s.vars.n);
        for (let i = 0; i < s.vars.n; i++) {
          s.vars.aux[i] = 0;
        }
        return s;
      },
    },
    ...execFor(
      'size',
      () => 1,
      (s) => s.vars.size < s.vars.n,
      (s) => s.vars.size,
      execFor(
        'leftStart',
        () => 0,
        (s) => s.vars.leftStart < s.vars.n,
        (s) => s.vars.size * 2,
        [
          {
            f(os) {
              const s = _.cloneDeep(os);
              s.vars.middle = Math.min(s.vars.leftStart + s.vars.size, s.vars.n);
              return s;
            },
          },
          {
            f(os) {
              const s = _.cloneDeep(os);
              s.vars.rightEnd = Math.min(s.vars.leftStart + 2 * s.vars.size, s.vars.n);
              return s;
            },
          },
          {
            f(os) {
              const s = _.cloneDeep(os);
              s.vars.left = s.vars.leftStart;
              return s;
            },
          },
          {
            f(os) {
              const s = _.cloneDeep(os);
              s.vars.right = s.vars.middle;
              return s;
            },
          },
          ...execFor(
            'i',
            (s) => s.vars.leftStart,
            (s) => s.vars.i < s.vars.rightEnd,
            1,
            [
              // if left < middle && (right >= rightEnd || arr[left] <= arr[right])
              ...execIfElse(
                (s) => s.vars.left < s.vars.middle
                      && (s.vars.right >= s.vars.rightEnd
                      || s.vars.arr[s.vars.left] <= s.vars.arr[s.vars.right]),
                // then
                [
                  {
                    f(os) {
                      const s = _.cloneDeep(os);
                      s.vars.aux[s.vars.i] = s.vars.arr[s.vars.left];
                      return s;
                    },
                  },
                  {
                    f(os) {
                      const s = _.cloneDeep(os);
                      s.vars.left++;
                      return s;
                    },
                  },
                ],
                // else
                [
                  {
                    f(os) {
                      const s = _.cloneDeep(os);
                      s.vars.aux[s.vars.i] = s.vars.arr[s.vars.right];
                      return s;
                    },
                  },
                  {
                    f(os) {
                      const s = _.cloneDeep(os);
                      s.vars.right++;
                      return s;
                    },
                  },
                ],
              ),
            ],
          ),
          ...execFor(
            'i',
            (s) => s.vars.leftStart,
            (s) => s.vars.i < s.vars.rightEnd,
            1,
            [
              {
                f(os) {
                  const s = _.cloneDeep(os);
                  s.vars.arr[s.vars.i] = s.vars.aux[s.vars.i];
                  return s;
                },
              },
            ],
          ),
        ],
      ),
    ),
  ];

  jsCodeExampleLines = [
    'const n = arr.length;',
    'const aux = new Array(n);',
    'for (let size = 1; size < n; size *= 2) {',
    '/**/for (let leftStart = 0; leftStart < n; leftStart += 2 * size) {',
    '/*____*/console;',
    '/*____*/const middle = Math.min(leftStart + size, n);',
    '/*____*/const rightEnd = Math.min(leftStart + 2 * size, n);',
    '/*____*/let left = leftStart;',
    '/*____*/let right = middle;',
    '/*____*/console;',
    '/*____*/for (let i = leftStart; i < rightEnd; i++) {',
    '/*________*/if (left < middle && (right >= rightEnd || arr[left] <= arr[right])) {',
    '/*____________*/aux[i] = arr[left];',
    '/*____________*/left++;',
    '/*________*/} else {',
    '/*____________*/aux[i] = arr[right];',
    '/*____________*/right++;',
    '/*________*/}',
    '/*____*/}',
    '/*____*/for (let i = leftStart; i < rightEnd; i++) {',
    '/*________*/arr[i] = aux[i];',
    '/*____*/}',
    '/**/}',
    '}',
  ];

  algos = [
    {
      name: 'Sortieren',
      algo: {
        code: this.jsCodeExampleLines,
        lines: this.linesForMergeSort,
        breakpoints: [21],
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
