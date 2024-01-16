import * as _ from 'lodash';
import BubbleSort from './BubbleSortLogic';
import CodeView from './CodeView';
import DataView from './DataView';
import InputView from './InputView';
import SortVisualizerView from './SortVisualizerView';
import UserErrorReporter from './UserErrorReporter';
import View from './View';

export default class AuD extends View {
  visualizerView;

  #clickListeners = {
    'aud-algoCtrlPlay': () => this.logic.play(),
    'aud-algoCtrlPause': () => this.logic.pause(),
    'aud-algoCtrlNextBreak': () => this.logic.nextBreak(),
    'aud-algoCtrlStep': () => this.logic.step(),
    'aud-algoCtrlReset': () => this.logic.reset(),
    'aud-algoStart': () => this.loadAlgoByIndex(this.dropdown.value),
  };

  constructor(parentNode) {
    super('AuD', parentNode, new UserErrorReporter());
    this.initPromise = this.initPromise.then(async () => {
      this.inputView = new InputView(
        document.getElementById('aud-input'),
        this.errorReporter,
        () => { this.#onFormValidChanged(); },
      );

      this.codeView = new CodeView(
        document.getElementById('aud-code'),
        this.errorReporter,
      );

      this.dataView = new DataView(
        document.getElementById('aud-data'),
        this.errorReporter,
      );

      this.dropdown = document.getElementById('aud-algoDropdown');
      if (!this.dropdown) {
        this.errorReporter.error('could not find id=algoDropdown!');
      }
      this.dropdown.onchange = (ev) => this.#selectedAlgoChanged(ev);

      Object.entries(this.#clickListeners).forEach(
        ([id, f]) => { document.getElementById(id).onclick = f; },
      );

      this.algoControls = document.getElementById('aud-algoControls');
      this.algoStart = document.getElementById('aud-algoStart');

      await Promise.all([
        this.inputView.initPromise,
        this.codeView.initPromise,
        this.dataView.initPromise,
      ]);
    });
  }

  #selectedAlgoChanged(ev) {
    const algo = this.logic.algos[ev.target.value];
    this.inputView.loadConfig(algo.inputs);
  }

  #onFormValidChanged() {
    this.algoStart.disabled = !this.inputView.validate()
        || (this.logic && this.logic.exec.isRunning());
  }

  loadAlgoByIndex(index) {
    const algo = this.logic.algos[index];
    this.algoControls.style.visibility = algo.algo ? 'visible' : 'hidden';
    if (algo.algo) {
      this.codeView.renderCode(algo.algo.code);
      this.codeView.renderBreakpoints(algo.algo.breakpoints);
      this.logic.loadAlgoByIndex(index, this.inputView.getValues());
    } else if (algo.func) {
      this.codeView.showEmpty();
      this.dataView.showEmpty();
      algo.func(this.inputView.getValues());
    } else {
      this.errorReporter.error('Not a valid algorithm config!');
    }
  }

  #onLogicStateChange(data, variables, line, running) {
    this.dataView.renderData(_.cloneDeep(variables));
    this.codeView.renderCurrentMarker(line);
    this.visualizerView.renderData(_.cloneDeep(data));
    this.inputView.setDisabled(running);
    this.#onFormValidChanged();
  }

  loadAuD(type) {
    new Promise((resolve) => {
      switch (type) {
        case 'BubbleSort':
          this.visualizerView = new SortVisualizerView(document.getElementById('aud-visu'), this.errorReporter);
          this.visualizerView.initPromise.then(() => {
            this.logic = new BubbleSort(
              this.errorReporter,
              (data, variables, line, running) => {
                this.#onLogicStateChange(data, variables, line, running);
              },
            );
            resolve();
          });
          break;
        default:
          this.errorReporter.error('Datenstruktur/Algo nicht gefunden!');
          break;
      }
    }).then(() => {
      this.dropdown.innerHTML = '<option value="" disabled selected>Bitte Algo Auswählen</option>';

      this.logic.algos.forEach((algo, i) => {
        const opt = document.createElement('option');
        opt.innerText = algo.func ? `⚡${algo.name}` : algo.name;
        opt.value = i;
        this.dropdown.appendChild(opt);
      });
    });
  }
}
