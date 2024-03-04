import View from './View';

// Diese Klasse alle derzeit gespeichtern Variablen und ihren Wert anzeigen
export default class DataView extends View {
  #container;

  constructor(parentNode, eventReporter) {
    super('DataView', parentNode, eventReporter);
    this.initPromise
      .then(() => {
        this.#container = document.getElementById('dataview-container');
        if (!this.#container) {
          eventReporter.fatal('element with id "dataview-container" not found!');
        }
      });
  }

  // zeigt die Daten an
  // (unter anderem?) aufgerufen in #onLogicStateChange(data, variables, line, running) in AuDView.js
  renderData(data) {
    if (data === null || data === undefined) {
      this.showEmpty();
      return;
    }
    const div = document.createElement('div');
    this.#renderData(div, data);
    this.#container.innerHTML = '';
    this.#container.appendChild(div);
  }

  #renderData(parentNode, data) {
    const div = document.createElement('div');
    switch (typeof data) {
      case 'object':
        if (!data) {
          div.innerText = String(data);
        }
        Object.keys(data).forEach((key) => {
          if (data[key] !== undefined) {
            const innerDiv = document.createElement('div');
            innerDiv.classList.add('d-flex');
            innerDiv.textContent = `${key}:`;
            this.#renderData(innerDiv, data[key]);
            div.appendChild(innerDiv);
          }
        });
        break;
      default:
        div.textContent = String(data);
    }
    div.classList.add(`dataview-type-${typeof data}`);
    parentNode.appendChild(div);
  }

  showEmpty() {
    this.#container.innerHTML = 'Placeholder for nothing to show';
  }
}
