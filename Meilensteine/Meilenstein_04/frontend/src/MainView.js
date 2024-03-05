import View from './View';
import SingleLinkedList from './SingleLinkedListLogic';
import AuDView from './AuDView';
import AdminView from './AdminView';
import UserView from './UserView';

// Die MainView lädt alle AoDs
export default class MainView extends View {
  #userApi;

  #singletonManager;

  #container;

  constructor(parentNode, singletonManager) {
    const eventReporter = singletonManager.get('EventReporter');
    super('MainView', parentNode, eventReporter);
    this.#singletonManager = singletonManager;

    const pageLoad = this.initPromise.then(() => {
      this.#container = document.getElementById('mainContainer');
      const lastLoad = localStorage.getItem('lastLoad');
      if (lastLoad) {
        this[lastLoad]();
      } else {
        this.loadStartpage();
      }
      const userContainer = document.getElementById('user-editor-offcanvas');
      new UserView(userContainer, this.#singletonManager);
    });
    this.#userApi = singletonManager.get('UserApi');
    Promise.all([/* this.#userApi.userGet() */Promise.resolve({ admin: true }), pageLoad]).then(([user]) => {
      if (user.admin) {
        const adminPanelLink = document.createElement('li');
        adminPanelLink.classList.add('nav-item', 'flex-fill');
        adminPanelLink.innerHTML = '<a data-onclick="loadAdminPanel" class="nav-link">Admin</a>';
        document.getElementById('before-admin').after(adminPanelLink);
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
        this.#container.innerHTML = data;
      });
  }

  // SingleLinkedList fetchen und Standardbeispiel laden
  loadSingleLinkedList() {
    this.setLastLoad('loadSingleLinkedList');
    fetch('SingleLinkedList.html')
      .then((response) => response.text())
      .then((data) => {
        this.#container.innerHTML = data;
        window.SLL = new SingleLinkedList();
      });
  }

  // DirectedUnweightedGraph fetchen und Standardbeispiel laden
  loadDirectedUnweightedGraph() {
    this.setLastLoad('loadDirectedUnweightedGraph');
    fetch('DirectedUnweightedGraph.html')
      .then((response) => response.text())
      .then((data) => {
        this.#container.innerHTML = data;
      });
  }

  // BubbleSort direkt laden und AuD-Logik einbinden
  loadBubbleSort() {
    this.setLastLoad('loadBubbleSort');

    // Einbinden der AuD-Logik
    const mainContainer = new AuDView(this.#container, this.#singletonManager);
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
    const mainContainer = new AuDView(this.#container, this.singletonManager);
    mainContainer.initPromise.then(
      () => {
        mainContainer.loadAuD('MergeSort');
      },
    );
  }

  async loadAdminPanel() {
    this.setLastLoad('loadAdminPanel');
    const adminView = new AdminView(this.#container, this.#singletonManager);
    await adminView.initPromise;
  }

  onClickLogout() {
    this.#userApi.userApitokenDelete().then(() => window.location.reload());
  }
}
