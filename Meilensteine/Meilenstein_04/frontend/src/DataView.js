import View from './View';

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

  renderData(data) {
    this.showEmpty()
    if (data === null || data === undefined) {
      this.showEmpty();
      return;
    }
    // SLL bricht die DataView, vielleicht gibt es hier einen schöneren Weg
    if (data.front !== undefined){
      this.showEmpty();
    } else {
    const div = document.createElement('div');
    this.#renderData(div, data);
    this.#container.innerHTML = '';
    this.#container.appendChild(div);
    }
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
