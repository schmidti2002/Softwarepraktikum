import View from './View';

export default class DataView extends View {
  #container;

  constructor(parentNode, errorReporter) {
    super('DataView', parentNode, errorReporter);
    this.initPromise
      .then(() => {
        this.#container = document.getElementById('dataview-container');
      });
  }

  renderData(data) {
    const div = document.createElement('div');
    this.#renderData(div, data);
    this.#container.innerHTML = '';
    this.#container.appendChild(div);
  }

  #renderData(parentNode, data) {
    const div = document.createElement('div');
    switch (typeof data) {
      case 'object':
        Object.keys(data).forEach((key) => {
          if (data[key] !== undefined) {
            const innerDiv = document.createElement('div');
            innerDiv.classList.add('d-flex');
            innerDiv.innerText = `${key}:`;
            this.#renderData(innerDiv, data[key]);
            div.appendChild(innerDiv);
          }
        });
        break;
      default:
        div.innerText = String(data);
    }
    div.classList.add(`dataview-type-${typeof data}`);
    parentNode.appendChild(div);
  }

  showEmpty() {
    this.#container.innerHTML = 'Placeholder for nothing to show';
  }
}
