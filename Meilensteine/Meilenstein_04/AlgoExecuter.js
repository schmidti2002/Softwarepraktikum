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

export function exe_start_block(state) {
  state.varsStack.push(Object.keys(state.vars).filter((n) => state.vars[n] !== undefined));
}

export function exe_end_block(state) {
  const existingVars = state.varsStack.pop();
  Object.keys(state.vars).forEach((n) => {
    if (!existingVars.includes(n)) {
      state.vars[n] = undefined;
    }
  });
}

export function exe_block(lines) {
  return [
    {
      f(s) {
        exe_start_block(s);
        return s;
      },
    },
    ...lines,
    {
      f(s) {
        exe_end_block(s);
        return s;
      },
    },

  ];
}

export function exe_for(counter, start, condition, step, lines) {
  return [
    {
      f(s) {
        s.vars[counter] = start(s);
        if (!condition(s)) {
          s.currentLine += lines.length + 2;
        }
        return s;
      },
    },
    {
      f(s) {
        exe_start_block(s);
        if (lines[0]) {
          return lines[0].f(s);
        }
        return s;
      },
    },
    ...lines.slice(1),
    {
      f(s) {
        exe_end_block(s);
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

export function exe_while(condition, lines) {
  [
    {
      f(s) {
        exe_start_block(s);
        if (!condition(s)) {
          s.currentLine += lines.length + 2;
        }
        return s;
      },
    },
    ...lines,
    {
      f(s) {
        s.currentLine -= lines.length + 1;
        exe_end_block(s);
        return s;
      },
    },
  ];
}

export function exe_ifElse(condition, lines, elsLines = []) {
  return [
    {
      f(s) {
        exe_start_block(s);
        if (!condition(s)) {
          s.currentLine += lines.length + 2;
        }
        return s;
      },
    },
    ...lines,
    {
      f(s) {
        exe_end_block(s);
        s.currentLine += elsLines.length + 1;
        if (elsLines.length) {
          exe_start_block(s);
        }
        return s;
      },
    },
    ...elsLines,
    ...(elsLines.length ? [{ f(s) { exe_end_block(s); return s; } }] : []),
  ];
}

export class Executer {
  lines; // Algo siehe oben: Minimal usage example for BubbleSort

  breakpoints = []; // Die lines, bei denen der Algo visualisiert wird. Zählweise siehe oben, immer eine line zählt 1

  timeout; // Zeit zwischen den Breakpoints, wenn der Algo durchläuft

  outputFunction = function () { }; // Funktion, um den AoD zu visualisieren

  state = {
    currentLine: -1, // Zeile, die der Algo gerade bearbeitet
    varsStack: [],
    vars: {},
  };

  OldState = {
    currentLine: -1,
    varsStack: [],
    vars: {},
  };

  intervalId;

  // Konstruktor
  constructor() {
    this.state.currentLine = -1;
  }

  // private; Führt eine line aus
  step() {
    // Abfrage vielleicht nicht nötig
    if (this.state.currentLine === this.lines.length || this.state.currentLine === -1) {
      this.stop();
      return;
    }
    const old_l = this.state.currentLine;
    const { f } = this.lines[this.state.currentLine];
    if (f) {
      this.state = f(this.state);
    }
    if (old_l === this.state.currentLine) {
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

  // private; Ruft step() bis zum nächsten Breakpoint auf
  nextBreakpoint() {
    let stepsCounter = 0;
    do {
      if (this.state.currentLine === this.lines.length || this.state.currentLine === -1) {
        this.stop();
        return;
      }
      this.step();
    } while (!this.breakpoints.includes(this.state.currentLine) && stepsCounter++ < 1000);
  }

  // Ändern des Algorithmus; stellt sicher, dass zurzeit kein Algorithmus läuft
  changeAlgo(lines, breakpoints, timeout) {
    if (this.state.currentLine === -1) {
      this.lines = lines;
      this.breakpoints = breakpoints;
      this.timeout = timeout;
      return true;
    }
    console.log('Algorithmus ist noch nicht beendet');
    return false;
  }

  // Führt einen Algorithmus zwangsweise aus, nur im Konstruktor einer Klasse zum Initialisieren der Datenstruktur verwenden.
  forcePlay(lines) {
    this.lines = lines;
    this.breakpoints = [];
    this.start();
    this.nextBreakpoint();
  }

  // private; initialisiert den Algo, falls er noch nicht läuft
  start() {
    if (this.state.currentLine === -1) {
      this.OldState = JSON.parse(JSON.stringify(this.state));
      this.state.currentLine = 0;
    }
  }

  // private; stoppt den Algo
  stop() {
    this.pause();
    this.state.currentLine = -1;
    this.outputFunction();
  }

  // Button Play
  play() {
    this.start();
    if (typeof intervalId === 'undefined') { // Prüft, das play() noch nicht läuft
      const self = this;
      this.intervalId = setInterval(() => {
        self.nextBreakpoint();
        self.outputFunction();
      }, this.timeout);
    }
  }

  // Button Pause
  pause() {
    clearInterval(this.intervalId);
    this.intervalId = 'undefined';
    this.outputFunction();
  }

  // Button Nächster Schritt
  next() {
    this.start();
    this.pause();
    this.nextBreakpoint();
    this.outputFunction();
  }

  // Button Reset
  reset() {
    console.log('1');
    this.stop();
    console.log('2');
    this.state = JSON.parse(JSON.stringify(this.OldState));
    console.log('3');
    this.outputFunction();
    console.log('4');
  }
}
