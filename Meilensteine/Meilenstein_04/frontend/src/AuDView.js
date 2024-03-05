import * as _ from 'lodash';
import BubbleSort from './BubbleSortLogic';
import SingleLinkedList from './SingleLinkedListLogic';
import DirectedUnweightedGraph from './DirectedUnweightedGraphLogic';
import CodeView from './CodeView';
import DataView from './DataView';
import InputView from './InputView';
import SortVisualizerView from './SortVisualizerView';
import ListVisualizerView from './ListVisualizerView';
import GraphVisualizerView from './GraphVisualizerView';
import View from './View';
import MergeSort from './MergeSortLogic';

// Diese Klasse verwaltet die Algorithmen und Datenstrukturen
// Die Klasse wird in MainView instanziert
export default class AuDView extends View {
  visualizerView;

  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('AuDView', parentNode, eventReporter);

    this.initPromise = this.initPromise.then(async () => {
      this.inputView = new InputView(
        document.getElementById('audview-input'),
        this.eventReporter,
        () => { this.#onFormValidChanged(); },
      );

      this.codeView = new CodeView(
        document.getElementById('audview-code'),
        this.eventReporter,
      );

      this.dataView = new DataView(
        document.getElementById('audview-data'),
        this.eventReporter,
      );

      this.dropdown = document.getElementById('audview-algoDropdown');
      if (!this.dropdown) {
        this.eventReporter.fatal('audview-could not find id=algoDropdown!');
      }
      this.dropdown.onchange = (ev) => this.#selectedAlgoChanged(ev);

      this.algoControls = document.getElementById('audview-algoControls');
      this.algoStart = document.getElementById('audview-algoStart');

      await Promise.all([
        this.inputView.initPromise,
        this.codeView.initPromise,
        this.dataView.initPromise,
      ]);
    });
  }

  // Die Buttons aus AuDView.html bekommen ihre entsprechende Funktionalität
  onClickCtrlPlay = () => this.logic.play();

  onClickCtrlPause = () => this.logic.pause();

  onClickCtrlNextBreak = () => this.logic.nextBreak();

  onClickCtrlStep = () => this.logic.step();

  onClickCtrlReset = () => this.logic.reset();

  onClickStart = () => this.loadAlgoByIndex(this.dropdown.value);

  onClickChangeLanguage = () => this.codeView.changeLanguage();

  #selectedAlgoChanged(ev) {
    const algo = this.logic.algos[ev.target.value];
    this.inputView.loadConfig(algo.inputs);
  }

  #onFormValidChanged() {
    this.algoStart.disabled = !this.inputView.validate()
        || (this.logic && this.logic.exec.isRunning());
  }

  // Einen Algorithmus (eines AoD) laden.
  // Die Algorithmen werden in den entsprechenden Logic-Klassen in algos[] definiert
  loadAlgoByIndex(index) {
    const algo = this.logic.algos[index];
    if (!algo) {
      return;
    }
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
      this.eventReporter.fatal('Not a valid algorithm config!');
    }
  }

  #onLogicStateChange(data, variables, line, running) {
    this.dataView.renderData(_.cloneDeep(variables));
    this.codeView.renderCurrentMarker(line);
    this.visualizerView.renderData(_.cloneDeep(data));
    this.inputView.setDisabled(running);
    this.#onFormValidChanged();
  } 

  // Einen Algorithmus oder Datenstruktur einladen
  // Wird in MainView gesetzt
  loadAuD(type) {
    new Promise((resolve) => {
      switch (type) {
        case 'BubbleSort':
          this.visualizerView = new SortVisualizerView(document.getElementById('audview-visu'), this.eventReporter);
          this.visualizerView.initPromise.then(() => {
            this.logic = new BubbleSort(
              this.eventReporter,
              (data, variables, line, running) => {
                this.#onLogicStateChange(data, variables, line, running);
              },
            );
            document.getElementById('outputDataContainer').remove();
            resolve();
          });
          break;
        case 'SingleLinkedList':
          this.visualizerView = new ListVisualizerView(document.getElementById('audview-visu'), this.eventReporter);
          this.visualizerView.initPromise.then(() => {
            this.logic = new SingleLinkedList(
              this.eventReporter,
              (data, variables, line, running) => {
                this.#onLogicStateChange(data, variables, line, running);
              },
            );
            resolve();
          });
          break;
        case 'DirectedUnweightedGraph':
          this.visualizerView = new GraphVisualizerView(document.getElementById('audview-visu'), this.eventReporter);
          this.visualizerView.initPromise.then(() => {
            this.logic = new DirectedUnweightedGraph(
              this.eventReporter,
              (data, variables, line, running) => {
                this.#onLogicStateChange(data, variables, line, running);
              },
            );
            resolve();
          });
          break;
        case 'MergeSort':
          this.visualizerView = new SortVisualizerView(document.getElementById('audview-visu'), this.eventReporter);
          this.visualizerView.initPromise.then(() => {
            this.logic = new MergeSort(
              this.eventReporter,
              (data, variables, line, running) => {
                this.#onLogicStateChange(data, variables, line, running);
              },
            );
            document.getElementById('outputDataContainer').remove();
            resolve();
          });
          break;
        default:
          this.eventReporter.fatal('Datenstruktur/Algo nicht gefunden!');
          break;
      }
    }).then(() => {
      this.dropdown.innerHTML = '<option value="" disabled selected>Bitte Algo Auswählen</option>';

      this.logic.algos.forEach((algo, i) => {
        const opt = document.createElement('option');
        opt.textContent = algo.func ? `⚡${algo.name}` : algo.name;
        opt.value = i;
        this.dropdown.appendChild(opt);
      });
    });
  }
}
