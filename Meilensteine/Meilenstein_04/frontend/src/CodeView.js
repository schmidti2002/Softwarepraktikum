import View from './View';

// Diese Klasse zeigt den Code eines Algorithmus einer AoD an
export default class CodeView extends View {
  #container;
  #language;
  #example;

  constructor(parentNode, eventReporter) {
    super('CodeView', parentNode, eventReporter);
    this.initPromise
      .then(() => {
        this.#container = document.getElementById('codeview-container');
        if (!this.#container) {
          eventReporter.fatal('elemnent with id "codeview-container" not found!');
        }
        this.#language = 'java'
      });
  }

  showEmpty() {
    // TODO good placeholder
    this.#container.innerHTML = ' ';
  }

  // zeigt den Code des derzeitigen Algorithmus an
  // dieser wird in lines[] in den Logikklassen gespeichert
  // wird in loadAlgoByIndex(index) in AuDView.js aufgerufen 
  renderCode(example) {
    this.#example = example;
    this.#render();
  }

  #render(){
    if(this.#language === 'java')
      var lines = this.#example.java;
    if(this.#language === 'javascript')
      var lines = this.#example.javascript;
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

  // zeigt die Position Breakpoints im Code an
  // die Breakpoint wereden in breakpoints[] in algo in algos[] der Logikklassen gespeichert
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

  // zeigt die aktuelle Position im Code an
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

  changeLanguage(){
    if(this.#language === 'java') {
      this.#language = 'javascript'
    } else {
      this.#language = 'java'
    }
    this.#render();
  }
}
