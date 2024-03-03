import { Executer } from './AlgoExecuter';

export default class Logic {
  algos = [];

  constructor(errorReporter) {
    this.errorReporter = errorReporter;
    this.exec = new Executer(errorReporter);
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

  loadAlgoByIndex(index, inputs) {
    const { algo } = this.algos[index];
    if (algo) {
      this.exec.changeAlgo(algo.lines, algo.breakpoints, 100, inputs);
    }
  }
}
