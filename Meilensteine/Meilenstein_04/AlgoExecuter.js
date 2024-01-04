/* Minimal usage example for BubbleSort:
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

exec = new ExampleExecuter(lines);
exec.state.vars.arr = [1,4,2,3];
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
                    s.line += lines.length + 2;
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
                    s.line -= lines.length;
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
                    s.line += lines.length + 2;
                }
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                s.line -= lines.length + 1;
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
                    s.line += lines.length + 2;
                }
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                exe_end_block(s);
                s.line += elsLines.length + 1;
                if(elsLines.length){
                    exe_start_block(s);
                }
                return s;
            }
        },
        ...elsLines,
        ...(elsLines.length ? [{f: function(s) {exe_end_block(s);}}] : [])
    ];
}

class Executer {
    lines;
    breakpoints = [];
    state = {
        varsStack: [],
        vars: {
        },
        line: 0
    };
    intervalId;
    outputFunction = function () { };
    algo_is_running;
    timeout = 100

    constructor(lines){
        this.lines = lines;
    };

    step() {
        //Abfrage vielleicht nicht nötig
        if(this.state.line === this.lines.length){
            this.stop()
            return
        }
        const old_l = this.state.line;
        const f = this.lines[this.state.line].f;
        if (f) {
            this.state = f(this.state);
        }
        if (old_l === this.state.line) {
            this.state.line += 1;
        } else if (typeof this.state.line === "string") {
            for (let i = 0; i < this.lines.length; i++) {
                if (this.lines[i].l === this.state.line) {
                    this.state.line = i;
                    break;
                }
            }
        }
    };

    nextBreakpoint() {
        var stepsCounter = 0;
        do {
            if (this.state.line == this.lines.length) {
                this.stop()
                return;
            }
            this.step();
        } while (!this.breakpoints.includes(this.state.line) && stepsCounter++ < 1000);
    };

    start(){
        if(!this.algo_is_running){
            this.state.line = 0
            this.state.vars.old_arr = [...this.state.vars.arr]
            this.algo_is_running = true
        }
    }

    stop(){
        this.pause()
        this.algo_is_running = false
        this.outputFunction()
    }

    play() {
        this.start()
        if (typeof intervalId === 'undefined') {
            const self = this;
            this.intervalId = setInterval(function () {
                self.nextBreakpoint()      
                self.outputFunction()
            }, this.timeout)
        }
    };

    pause() {
        clearInterval(this.intervalId)
        this.outputFunction()
    };

    next(){
        this.pause()
        this.nextBreakpoint()
        this.outputFunction()
    }

    reset(){
        this.stop()
        this.state.vars.arr = [...this.state.vars.old_arr]
        this.outputFunction()
    }
}
