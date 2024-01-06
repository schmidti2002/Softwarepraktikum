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

function exe_start_block(state){
    state.varsStack.push(Object.keys(state.vars).filter(n => state.vars[n] !== undefined));
}

function exe_end_block(state){
    existingVars = state.varsStack.pop();
    Object.keys(state.vars).forEach((n) => {
            if (!existingVars.includes(n)) {
                state.vars[n] = undefined;
            }
        });
}

function exe_block(lines) {
    return [
        {
            f: function (s) {
                exe_start_block(s);
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                exe_end_block(s);
                return s;
            }
        }

    ];
}

function exe_for(counter, start, condition, step, lines) {
    return [
        {
            f: function (s) {
                s.vars[counter] = start(s);
                if (!condition(s)) {
                    s.currentLine += lines.length + 2;
                }
                return s;
            }
        },
        {
            f: function (s) {
                exe_start_block(s);
                if (lines[0]) {
                    return lines[0].f(s);
                }
                return s;
            }
        },
        ...lines.slice(1),
        {
            f: function (s) {
                exe_end_block(s);
                s.vars[counter] += typeof step === "number" ? step : step(s);
                if (condition(s)) {
                    s.currentLine -= lines.length;
                    return s;
                }
                s.vars[counter] = undefined;
                return s;
            }
        },
    ];
}

function exe_while(condition, lines) {
    [
        {
            f: function (s) {
                exe_start_block(s);
                if (!condition(s)) {
                    s.currentLine += lines.length + 2;
                }
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                s.currentLine -= lines.length + 1;
                exe_end_block(s);
                return s;
            }
        },
    ];
}

function exe_ifElse(condition, lines, elsLines = []) {
    return [
        {
            f: function (s) {
                exe_start_block(s);
                if (!condition(s)) {
                    s.currentLine += lines.length + 2;
                }
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                exe_end_block(s);
                s.currentLine += elsLines.length + 1;
                if(elsLines.length){
                    exe_start_block(s);
                }
                return s;
            }
        },
        ...elsLines,
        ...(elsLines.length ? [{f: function(s) {exe_end_block(s); return s; }}] : [])
    ];
}

class Executer {
    lines;      // Algo siehe oben: Minimal usage example for BubbleSort
    breakpoints = [];   // Die lines, bei denen der Algo visualisiert wird. Zählweise siehe oben, immer eine line zählt 1
    state = {
        currentLine: -1,  // Zeile, die der Algo gerade bearbeitet
        varsStack: [],
        vars: {},
    };
    intervalId;
    outputFunction = function () { };   // Funktion, um den AoD zu visualisieren
    timeout;      // Zeit zwischen den Breakpoints, wenn der Algo durchläuft

    // Konstruktor
    constructor(){
        this.state.currentLine = -1;
    };

    // private; Führt eine line aus
    step() {
        // Abfrage vielleicht nicht nötig
        if(this.state.currentLine === this.lines.length || this.state.currentLine === -1){
            this.stop()
            return
        }
        const old_l = this.state.currentLine;
        const f = this.lines[this.state.currentLine].f;
        if (f) {
            this.state = f(this.state);
        }
        if (old_l === this.state.currentLine) {
            this.state.currentLine += 1;
        } else if (typeof this.state.currentLine === "string") {
            for (let i = 0; i < this.lines.length; i++) {
                if (this.lines[i].l === this.state.currentLine) {
                    this.state.currentLine = i;
                    break;
                }
            }
        }
    };

    // private; Ruft step() bis zum nächsten Breakpoint auf
    nextBreakpoint() {
        var stepsCounter = 0;
        do {
            if (this.state.currentLine === this.lines.length || this.state.currentLine === -1) {
                this.stop()
                return;
            }
            this.step();
        } while (!this.breakpoints.includes(this.state.currentLine) && stepsCounter++ < 1000);
    };

    // private; initialisiert den Algo, falls er noch nicht läuft
    start(){
        if(this.state.currentLine === -1){
            this.state.currentLine = 0
            //this.state.vars.old_arr = [...this.state.vars.arr]
        }
    }

    // private; stoppt den Algo
    stop(){
        this.pause()
        this.state.currentLine = -1
        this.outputFunction()
    }

    // Button Play
    play() {
        this.start()
        if (typeof intervalId === 'undefined') {    // Prüft, das play() noch nicht läuft
            const self = this;
            this.intervalId = setInterval(function () {
                self.nextBreakpoint()      
                self.outputFunction()
            }, this.timeout)
        }
    };

    // Button Pause
    pause() {        
        clearInterval(this.intervalId)
        this.intervalId = 'undefined'
        this.outputFunction()
    };
    
    // Button Nächster Schritt
    next(){
        this.start()
        this.pause()
        this.nextBreakpoint()
        this.outputFunction()
    }

    // Button Reset
    reset(){
        this.stop()
        //this.state.vars.arr = [...this.state.vars.old_arr]
        this.outputFunction()
    }
}
