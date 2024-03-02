import View from './View';

// Diese Klasse zeigt den Code eines Algorithmus einer AoD an
export default class CodeView extends View {
  #container;

  constructor(parentNode, eventReporter) {
    super('CodeView', parentNode, eventReporter);
    this.initPromise
      .then(() => {
        this.#container = document.getElementById('codeview-container');
        if (!this.#container) {
          eventReporter.fatal('elemnent with id "codeview-container" not found!');
        }
      });
  }

  showEmpty() {
    // TODO good placeholder
    this.#container.innerHTML = 'Placeholder for nothing to show';
  }

  // zeigt den Code, in lines in den Logikklassen gespeichert, an
  // wird in loadAlgoByIndex(index) in AuDView.js aufgerufen 
  renderCode(lines) {
    if (!lines || !lines.length) {
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

  // zeigt die Breakpoint, in breakpoints in algo in algos[] der Logikklassen gespeichert, an
  // wird in loadAlgoByIndex(index) in AuDView.js aufgerufen 
  renderBreakpoints(breakpoints) {
    this.#container.firstChild.childNodes.forEach((child, lineNr) => {
      if (breakpoints.includes(lineNr)) {
        child.classList.add('break');
      } else {
        child.classList.remove('break');
      }
    });
  }

  // zeigt vermutlich die aktuelle Position im Code an???
  // (unter anderem?) aufgerufen in #onLogicStateChange(data, variables, line, running) in AuDView.js
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
