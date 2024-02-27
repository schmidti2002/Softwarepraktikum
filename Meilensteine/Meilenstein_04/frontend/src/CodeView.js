import View from './View';

export default class CodeView extends View {
  #container;

  constructor(parentNode, eventReporter) {
    super('CodeView', parentNode, eventReporter);
    this.initPromise
      .then(() => {
        this.#container = document.getElementById('codeview-container');
      });
  }

  showEmpty() {
    // TODO good placeholder
    this.#container.innerHTML = 'Placeholder for nothing to show';
  }

  renderCode(lines) {
    if (!lines) {
      this.showEmpty();
      return;
    }
    const table = document.createElement('table');
    lines.forEach((line, lineNr) => {
      const tr = document.createElement('tr');
      const lineNrTd = document.createElement('td');
      lineNrTd.textContent = lineNr;
      tr.appendChild(lineNrTd);
      const lineTd = document.createElement('td');
      lineTd.textContent = line;
      tr.appendChild(lineTd);
      table.appendChild(tr);
    });
    this.#container.innerHTML = '';
    this.#container.appendChild(table);
  }

  renderBreakpoints(breakpoints) {
    this.#container.firstChild.childNodes.forEach((child, lineNr) => {
      if (breakpoints.includes(lineNr)) {
        child.classList.add('break');
      } else {
        child.classList.remove('break');
      }
    });
  }

  renderCurrentMarker(line) {
    this.#container.firstChild.childNodes.forEach((child, lineNr) => {
      if (lineNr === line) {
        child.classList.add('line');
      } else {
        child.classList.remove('line');
      }
    });
  }
}
