import * as _ from 'lodash';
import { execFor, execIfElse } from './AlgoExecuter';
import Logic from './Logic';
import { arrayEveryEntry, minMax, notEmpty } from './inputValidators';

// Klasse für den BubbleSort
export default class BubbleSort extends Logic {
  #stateChangeCallback;

  // Konstruktor
  constructor(errorReporter, stateChangeCallback) {
    super(errorReporter);
    this.#stateChangeCallback = stateChangeCallback;
    console.log(this.exec);
    this.exec.changeAlgo(
      this.linesForBubbleSort,
      [8],
      10,
      { arr: [50, 35, 40, 15, 30, 45, 5, 20, 25, 10] },
    );
    this.exec.outputFunction = () => this.showOutput();
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
      func: (inputs) => this.generate(inputs.count),
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
      func: (inputs) => this.generate(inputs.count),
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
  ];

  // Array ausgeben, um es zu bearbeiten
  showArray() {
    document.getElementById('Array').value = this.exec.state.vars.arr;
  }

  // Funktion zum Einlesen der eigenen Werte
  parseArray() {
    const inputArray = document.getElementById('Array').value.split(',');
    const integerArray = [];

    for (let i = 0; i < inputArray.length; i++) {
      const integerValue = parseInt(inputArray[i].trim(), 10); // Basis 10 für Dezimalzahlen
      if (!Number.isNaN(integerValue)) {
        integerArray.push(integerValue);
      }
    }

    this.exec.state.vars.arr = integerArray;
    this.showOutput();
  }

  // Funktion, um n einzulesen und n Zufallszahlen zu generieren und anzuzeigen
  generateRandomNumbers() {
    // Die Anzahl der Zufallszahlen vom Benutzer eingeben lassen
    const count = parseInt(document.getElementById('userInput').value, 10);
    this.generate(count);
  }

  // Funktion, um n Zufallszahlen zu generieren
  generate(count) {
    // Zufallszahlen initialisieren und anzeigen
    this.exec.state.vars.arr = [];
    for (let i = 0; i < count; i++) {
      const randomNumber = Math.floor(Math.random() * 50) + 1; // Zufallszahlen zwischen 1 und 50
      this.exec.state.vars.arr.push(randomNumber);
    }
    this.showOutput();
  }

  // Container 'newValues' öffnen/schließen
  newValues() {
    if (document.getElementById('newValues').style.display === 'block') {
      this.hide();
    } else {
      document.getElementById('newValues').style.display = 'block';
      document.getElementById('editValues').style.display = 'none';
      document.getElementById('openSort').style.display = 'none';
    }
  }

  // Container 'editValues' öffnen/schließen
  editValues() {
    if (document.getElementById('editValues').style.display === 'block') {
      this.hide();
    } else {
      document.getElementById('newValues').style.display = 'none';
      document.getElementById('editValues').style.display = 'block';
      document.getElementById('openSort').style.display = 'none';
    }
  }

  // Container 'openSort' öffnen/schließen
  openSort() {
    if (document.getElementById('openSort').style.display === 'block') {
      this.hide();
    } else {
      document.getElementById('newValues').style.display = 'none';
      document.getElementById('editValues').style.display = 'none';
      document.getElementById('openSort').style.display = 'block';
    }
  }

  // Alle Container schließen
  hide() {
    document.getElementById('newValues').style.display = 'none';
    document.getElementById('editValues').style.display = 'none';
    document.getElementById('openSort').style.display = 'none';
  }

  // Funktion, um das Array auszugeben
  showOutput() {
    this.#stateChangeCallback(
      this.exec.state.vars.arr,
      this.exec.state.vars,
      this.exec.state.currentLine,
      this.exec.isRunning(),
    );
    // Dieser Teil ist gut zum Debuggen, kann man später vielleicht weglassen
    const output = document.getElementById('ausgabe');
    if (!output) {
      console.error('id=ausgabe not found');
      return;
    }
    const { arr } = this.exec.state.vars;
    output.innerHTML = `Das Array lautet: ${arr ? arr.join(', ') : ''}`;
    if (!this.exec.state.vars === -1) {
      output.innerHTML += `, Algo läuft in Line:${this.exec.state.currentLine}`;
    }
    // wichtig
    this.renderBars();
  }

  // Visualisiert Array in Balken-Diagramm auf Canvas
  renderBars() {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    const { arr } = this.exec.state.vars;
    for (let i = 0; arr && i < this.exec.state.vars.arr.length; i++) { // For erstellt alle Bars
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.width = '20px'; // Skaliere Breite der Bars

      // Skaliere die Höhe der Bars:
      bar.style.height = `${this.exec.state.vars.arr[i] * 10 + 10}px`;
      bar.innerHTML = `<span>${this.exec.state.vars.arr[i]}</span>`;
      chart.appendChild(bar);
    }
  }
}
