import View from './View';
import SingleLinkedList from './SingleLinkedListLogic';
import AuDView from './AuDView';

// Die MainView lädt alle AoDs
export default class MainView extends View {
  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('MainView', parentNode, eventReporter);
    this.singletonManager = singletonManager;

    this.initPromise.then(() => {
      this.content = document.getElementById('mainContainer');
      const lastLoad = localStorage.getItem('lastLoad');
      if (lastLoad) {
        this[lastLoad]();
      } else {
        this.loadStartpage();
      }
    });
  }

  // merkt sich, wo man in der Webanwendung ist, um bei Neuladen wieder dorthin zurückzukehren
  // eslint-disable-next-line class-methods-use-this
  setLastLoad(value) {
    localStorage.setItem('lastLoad', value);
  }

  // Startseite fetchen
  loadStartpage() {
    this.setLastLoad('loadStartpage');
    fetch('StartPage.html')
      .then((response) => response.text())
      .then((data) => {
        this.content.innerHTML = data;
      });
  }

  // SingleLinkedList fetchen und Standardbeispiel laden
  loadSingleLinkedList() {
    this.setLastLoad('loadSingleLinkedList');
    fetch('SingleLinkedList.html')
      .then((response) => response.text())
      .then((data) => {
        this.content.innerHTML = data;
        window.SLL = new SingleLinkedList();
      });
  }

  // DirectedUnweightedGraph fetchen und Standardbeispiel laden
  loadDirectedUnweightedGraph() {
    this.setLastLoad('loadDirectedUnweightedGraph');
    fetch('DirectedUnweightedGraph.html')
      .then((response) => response.text())
      .then((data) => {
        this.content.innerHTML = data;
      });
  }

  // BubbleSort direkt laden und AuD-Logik einbinden
  loadBubbleSort() {
    this.setLastLoad('loadBubbleSort');

    // Einbinden der AuD-Logik
    const container = document.getElementById('mainContainer');
    const mainContainer = new AuDView(container, this.singletonManager);
    mainContainer.initPromise.then(
      () => {
        mainContainer.loadAuD('BubbleSort');
      },
    );
  }

  // MergeSort fetchen und Standardbeispiel laden
  loadMergeSort() {
    this.setLastLoad('loadMergeSort');

    // Einbinden der AuD-Logik
    const container = document.getElementById('mainContainer');
    const mainContainer = new AuDView(container, this.singletonManager);
    mainContainer.initPromise.then(
      () => {
        mainContainer.loadAuD('MergeSort');
      },
    );
  }

  // ToDo: Größe des Containers für das Benutzerprofil anpassen,
  // sodass er sich rechts am Rand öffnet/schließt
  showUserEditor() {
    const container = document.getElementById('container');
    const mainContainer = document.getElementById('mainContainer');
    const userEditor = document.getElementById('userEditor');
    container.style.flexDirection = 'row';

    if (mainContainer.style.width === '100%') { // Benutzerprofil ist bereits ausgeblendet
      mainContainer.style.width = '75%';
      userEditor.style.width = '25%';
      fetch('UserEditor.html')
        .then((response) => response.text())
        .then((data) => {
          userEditor.innerHTML = data;
        });
    } else { // Benutzerprofil ist bereits eingeblendet
      mainContainer.style.width = '100%';
      userEditor.style.width = '0%';
      userEditor.innerHTML = '';
    }
  }
}
