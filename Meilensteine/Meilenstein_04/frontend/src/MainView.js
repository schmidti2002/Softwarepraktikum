import View from './View';
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
    // zum Debuggen geändert
    localStorage.setItem('lastLoad', 'loadStartpage');
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

    // Einbinden der AuD-Logik
    const mainContainer = new AuDView(this.#container, this.#singletonManager);
    mainContainer.initPromise.then(
      () => {
        mainContainer.loadAuD('SingleLinkedList');
      },
    );
  }

  // SingleLinkedList fetchen und Standardbeispiel laden
  loadDirectedUnweightedGraph() {
    this.setLastLoad('loadDirectedUnweightedGraph');

    // Einbinden der AuD-Logik
    const mainContainer = new AuDView(this.#container, this.#singletonManager);
    mainContainer.initPromise.then(
      () => {
        mainContainer.loadAuD('DirectedUnweightedGraph');
      },
    );
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
    const mainContainer = new AuDView(this.#container, this.#singletonManager);
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

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    document.getElementById('darkModeToggle').classList.toggle('inverted');
  }

  convertToImage() {
    const content = document.getElementById('mainContainer');
    html2canvas(content).then(canvas => {
      // Hier haben Sie das Canvas-Element, das Sie als Bild speichern können
      const image = canvas.toDataURL('image/png');

      // Optional: Speichern Sie das Bild als Datei (nur in unterstützten Browsern)
      const a = document.createElement('a');
      a.href = image;
      a.download = 'Algosaurus.png';
      a.click();
    });
  }

  convertToPDF() {
    const content = document.getElementById('mainContainer');
    html2canvas(content).then(canvas => {
      // Erstellen Sie ein Image aus dem Canvas
      const imgData = canvas.toDataURL('image/png');

      // Initialisieren Sie jsPDF
      const pdf = new jspdf.jsPDF({
        orientation: 'p',
        unit: 'px',
        format: 'a4',
      });

      // Fügen Sie das Image zum PDF hinzu
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Speichern Sie das PDF
      pdf.save('Algosaurus.pdf');
    });
  }
}
