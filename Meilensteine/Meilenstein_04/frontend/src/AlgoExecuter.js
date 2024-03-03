import * as _ from 'lodash';
/*
Minimal usage example for BubbleSort:
lines = [
    { f: function (s) { s.vars.temp = undefined; return s; } },
    { f: function (s) { s.vars.n = s.vars.arr.length; return s; } },
    ...exe_for("i", () => 0, s => s.vars.i < s.vars.n - 1, 1,
        exe_for("k", () => 0, s => s.vars.k < s.vars.n - 1 - s.vars.i, 1,
            exe_ifElse(s => s.vars.arr[s.vars.k] > s.vars.arr[s.vars.k + 1], [
                { f: function (s) { s.vars.temp = s.vars.arr[s.vars.k]; return s; } },
                { f: function (s) { s.vars.arr[s.vars.k] = s.vars.arr[s.vars.k + 1]; return s; } },
                { f: function (s) { s.vars.arr[s.vars.k + 1] = s.vars.temp; return s; } },
            ])
        )
    )
];

exec = new Executer(lines);
exec.state.vars.arr = [1,4,2,3];
exec.outputFunction = () => showOutput(); // oder eine andere Funktion
exec.play(false, () => console.log(JSON.stringify(exec.state.vars.arr)));
*/

function execStartBlock(oldState) {
  const state = _.cloneDeep(oldState);
  state.varsStack.push(Object.keys(state.vars).filter((n) => state.vars[n] !== undefined));
  return state;
}

function execEndBlock(oldState) {
  const state = _.cloneDeep(oldState);
  const existingVars = state.varsStack.pop();
  Object.keys(state.vars).forEach((n) => {
    if (!existingVars.includes(n)) {
      state.vars[n] = undefined;
    }
  });
  return state;
}

export function execBlock(lines) {
  return [
    {
      f(s) {
        return execStartBlock(s);
      },
    },
    ...lines,
    {
      f(s) {
        return execEndBlock(s);
      },
    },

  ];
}

export function execFor(counter, start, condition, step, lines) {
  return [
    {
      f(os) {
        const s = _.cloneDeep(os);
        s.vars[counter] = start(s);
        if (!condition(s)) {
          s.currentLine += lines.length + 2;
        }
        return s;
      },
    },
    {
      f(os) {
        let s = _.cloneDeep(os);
        s = execStartBlock(s);
        if (lines[0]) {
          return lines[0].f(s);
        }
        return s;
      },
    },
    ...lines.slice(1),
    {
      f(os) {
        let s = _.cloneDeep(os);
        s = execEndBlock(s);
        s.vars[counter] += typeof step === 'number' ? step : step(s);
        if (condition(s)) {
          s.currentLine -= lines.length;
          return s;
        }
        s.vars[counter] = undefined;
        return s;
      },
    },
  ];
}

export function execWhile(condition, lines) {
  return [
    {
      f(os) {
        let s = _.cloneDeep(os);
        s = execStartBlock(s);
        if (!condition(s)) {
          s.currentLine += lines.length + 2;
        }
        return s;
      },
    },
    ...lines,
    {
      f(os) {
        let s = _.cloneDeep(os);
        s.currentLine -= lines.length + 1;
        s = execEndBlock(s);
        return s;
      },
    },
  ];
}

export function execIfElse(condition, lines, elsLines = []) {
  return [
    {
      f(os) {
        let s = _.cloneDeep(os);
        s = execStartBlock(s);
        if (!condition(s)) {
          s.currentLine += lines.length + 2;
        }
        return s;
      },
    },
    ...lines,
    {
      f(os) {
        let s = _.cloneDeep(os);
        s = execEndBlock(s);
        s.currentLine += elsLines.length + 1;
        if (elsLines.length) {
          s = execStartBlock(s);
        }
        return s;
      },
    },
    ...elsLines,
    ...(elsLines.length ? [{ f(s) { return execEndBlock(s); } }] : []),
  ];
}

export class Executer {
  lines; // Algo siehe oben: Minimal usage example for BubbleSort

  // Die lines, bei denen der Algo visualisiert wird. Zählweise siehe oben, immer eine line zählt 1
  breakpoints = [];

  timeout; // Zeit zwischen den Breakpoints, wenn der Algo durchläuft

  outputFunction = function () { }; // Funktion, um den AoD zu visualisieren

  state = {
    currentLine: 0, // Zeile, die der Algo gerade bearbeitet
    varsStack: [],
    vars: {},
  };

  OldState = {
    currentLine: 0,
    varsStack: [],
    vars: {},
  };

  intervalId;

  // Konstruktor
  constructor(errorReporter) {
    this.errorReporter = errorReporter;
  }

  // private; Führt eine line aus
  #step() {
    // Abfrage vielleicht nicht nötig
    if (this.state.currentLine === this.lines.length) {
      this.#stop();
      return;
    }
    const oldLine = this.state.currentLine;
    const { f } = this.lines[this.state.currentLine];
    if (f) {
      this.state = f(this.state);
    }
    if (oldLine === this.state.currentLine) {
      this.state.currentLine += 1;
    } else if (typeof this.state.currentLine === 'string') {
      for (let i = 0; i < this.lines.length; i++) {
        if (this.lines[i].l === this.state.currentLine) {
          this.state.currentLine = i;
          break;
        }
      }
    }
  }

  step() {
    this.#step();
    this.outputFunction();
  }

  // private; Ruft step() bis zum nächsten Breakpoint auf
  #nextBreakpoint() {
    let stepsCounter = 0;
    do {
      if (this.state.currentLine === this.lines.length) {
        this.#stop();
        return;
      }
      this.#step();
    } while (!this.breakpoints.includes(this.state.currentLine) && stepsCounter++ < 1000);
  }

  // Ändern des Algorithmus; stellt sicher, dass zurzeit kein Algorithmus läuft
  changeAlgo(lines, breakpoints, timeout, vars) {
    if (!this.isRunning()) {
      this.lines = lines;
      this.breakpoints = breakpoints;
      this.timeout = timeout;
      this.state = {
        currentLine: 0,
        varsStack: [],
        vars,
      };
      this.OldState = _.cloneDeep(this.state);
      return true;
    }
    this.errorReporter.warn('Algorithmus ist noch nicht beendet');
    return false;
  }

  // Führt einen Algorithmus zwangsweise aus
  // Nur im Konstruktor einer Klasse zum Initialisieren der Datenstruktur verwenden.
  forcePlay(lines) {
    this.lines = lines;
    this.breakpoints = [];
    this.#nextBreakpoint();
  }

  isRunning() {
    return this.intervalId !== undefined;
  }

  // private; stoppt den Algo
  #stop() {
    this.pause();
    this.outputFunction();
  }

  // Button Play
  play() {
    if (!this.isRunning()) { // Prüft, das play() noch nicht läuft
      const self = this;
      this.intervalId = setInterval(() => {
        self.#nextBreakpoint();
        self.outputFunction();
      }, this.timeout);
    }
  }

  // Button Pause
  pause() {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
    this.outputFunction();
  }

  // Button Nächster Schritt
  next() {
    this.pause();
    this.#nextBreakpoint();
    this.outputFunction();
  }

  // Button Reset
  reset() {
    this.#stop();
    this.state = _.cloneDeep(this.OldState);
    this.outputFunction();
  }
}
