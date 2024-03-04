import View from './View';

// Diese Klasse alle derzeit gespeichtern Variablen und ihren Wert anzeigen
export default class DataView extends View {
  #simpleDataContainer;

  #objContainer;

  constructor(parentNode, eventReporter) {
    super('DataView', parentNode, eventReporter);
    this.initPromise
      .then(() => {
        this.#objContainer = document.getElementById('objContainer');
        if (!this.#objContainer) {
          eventReporter.fatal('element with id "objContainer" not found!');
        }
        this.#simpleDataContainer = document.getElementById('simpleDataContainer');
        if (!this.#simpleDataContainer) {
          eventReporter.fatal('element with id "simpleDataContainer" not found!');
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
    const divObj = document.createElement('div');
    divObj.classList.add('border');
    const divSimple = document.createElement('div');
    this.#renderData(divObj, divSimple, data);
    this.#objContainer.innerHTML = '';
    this.#objContainer.appendChild(divObj);
    this.#simpleDataContainer.innerHTML = '';
    this.#simpleDataContainer.appendChild(divSimple);
  }

  #renderData(parentNodeObj, parentNodeSimple, data) {
    const divObj = document.createElement('div');
    divObj.classList.add('row');
    const divSimple = document.createElement('div');
    switch (typeof data) {
      case 'object':
        if (!data) {
          divSimple.innerText = String(data);
        }
        Object.keys(data).forEach((key) => {
          if (data[key] !== undefined) {
            const innerDiv = document.createElement('div');
            innerDiv.classList.add('d-flex');
            innerDiv.textContent = `${key}:`;
            // primärer Datentyp oder Objekt?
            if (typeof data[key] === 'number' || typeof data[key] === 'string' || typeof data[key] === 'boolean') {
              this.#renderDataSimple(innerDiv, data[key]);
              divSimple.appendChild(innerDiv);
            } else {
              innerDiv.classList.add('col');
              innerDiv.classList.add('border');
              this.#renderDataObject(innerDiv, data[key]);
              divObj.appendChild(innerDiv);
            }
          }
        });
        break;
      default:
        divSimple.textContent = String(data);
    }
    divObj.classList.add(`dataview-type-${typeof data}`);
    parentNodeObj.appendChild(divObj);
    divSimple.classList.add(`dataview-type-${typeof data}`);
    parentNodeSimple.appendChild(divSimple);
  }

  #renderDataSimple(parentNode, data) {
    const div = document.createElement('div');
    div.textContent = String(data);
    div.classList.add(`dataview-type-${typeof data}`);
    parentNode.appendChild(div);
  }

  #renderDataObject(parentNode, data) {
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
            this.#renderDataObject(innerDiv, data[key]);
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
    this.#objContainer.innerHTML = 'Placeholder for nothing to show';
    this.#simpleDataContainer.innerHTML = 'Placeholder for nothing to show';
  }
}
