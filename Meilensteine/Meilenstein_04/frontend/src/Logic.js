import { Executer } from './AlgoExecuter';

// Dies ist die Parent-Klasse für alle weiter Logikklassen (BubbleSort, SLL, etc.)
// diese wird im Konstruktur der Kinder aufgerufen
export default class Logic {
  algos = []; // speichert die algos, diese werden in den Kindern gefüllt

  constructor(eventReporter, stateChangeCallback) {
    this.eventReporter = eventReporter;
    this.exec = new Executer(eventReporter);   // Hier wird der AlgoExecuter instanziert
    this.stateChangeCallback = stateChangeCallback;
  }

  stateChangeCallback = () => {}; // data, variables, line

  play() {
    this.exec.play();
  }

  pause() {
    this.exec.pause();
  }

  step() {
    this.exec.step();
  }

  nextBreak() {
    this.exec.next();
  }

  reset() {
    this.exec.reset();
  }

  // Einen Algorithmus mit index und inputs (als Objekt, z.B.: {arr: [1,2,3]}) laden
  // Wird aufgerufen in loadAlgoByIndex(index) in AuDView.js
  loadAlgoByIndex(index, inputs) {
    const { algo } = this.algos[index];
    if (algo) {
      this.exec.changeAlgo(algo.lines, algo.breakpoints, 100, inputs);
    } else {
      this.eventReporter.fatal(`No algorithm with index ${index}!`);
    }
  }
}
