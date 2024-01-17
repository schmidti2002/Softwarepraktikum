import SingleLinkedList from './SingleLinkedListLogic';
import AuD from './AuD';

const content = document.getElementById('mainContainer');

// Startseite fetchen
export function loadStartpage() {
  localStorage.setItem('lastLoad', 'loadStartpage');
  fetch('StartPage.html')
    .then((response) => response.text())
    .then((data) => {
      content.innerHTML = data;
    });
}

// SingleLinkedList fetchen und Standardbeispiel laden
export function loadSingleLinkedList() {
  localStorage.setItem('lastLoad', 'loadSingleLinkedList');
  fetch('SingleLinkedList.html')
    .then((response) => response.text())
    .then((data) => {
      content.innerHTML = data;
      window.SLL = new SingleLinkedList();
    });
}

// DirectedUnweightedGraph fetchen und Standardbeispiel laden
export function loadDirectedUnweightedGraph() {
  localStorage.setItem('lastLoad', 'loadDirectedUnweightedGraph');
  fetch('DirectedUnweightedGraph.html')
    .then((response) => response.text())
    .then((data) => {
      content.innerHTML = data;
    });
}

// BubbleSort direkt laden und AuD-Logik einbinden
export function loadBubbleSort() {
  localStorage.setItem('lastLoad', 'loadBubbleSort');

  // Einbinden der AuD-Logik
  const container = document.getElementById('mainContainer');
    const mainContainer = new AuD(container);
    mainContainer.initPromise.then(
      () => {
        mainContainer.loadAuD('BubbleSort');
      },
  );
}

// MergeSort fetchen und Standardbeispiel laden
export function loadMergeSort() {
  localStorage.setItem('lastLoad', 'loadMergeSort');
  fetch('MergeSort.html')
    .then((response) => response.text())
    .then((data) => {
      content.innerHTML = data;
    });
}

// ToDo: Größe des Containers für das Benutzerprofil anpassen,
// sodass er sich rechts am Rand öffnet/schließt
export function showUserEditor() {
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

export function restore() {
  const lastLoad = localStorage.getItem('lastLoad');
  if (lastLoad) {
    setTimeout(() => window[lastLoad](), 500);
  } else {
    loadStartpage();
  }
}

restore();
showUserEditor();
