
function exe_block(lines) {
    return [
        {
            f: function (s) {
                s.varsStack.push(Object.keys(s.vars).filter(n => s.vars[n] !== undefined));
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                existingVars = s.varsStack.pop();
                Object.keys(s.vars).forEach((n) => {
                    if (!existingVars.includes(n)) {
                        s.vars[n] = undefined;
                    }
                })
                return s;
            }
        }

    ];
}

function exe_for(counter, start, condition, step, lines) {
    exe_block([
        {
            f: function (s) {
                s.vars[counter] = start(s);
                if (!condition(s)) {
                    s.line += lines.length + 2;
                }
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                s.vars[counter] += typeof step === "number" ? step : step(s);
                if (condition(s)) {
                    s.line -= lines.length;
                }
                return s;
            }
        },
    ]);
}

function exe_while(condition, lines) {
    exe_block([
        {
            f: function (s) {
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
                return s;
            }
        },
    ]);
}

function exe_ifElse(condition, lines, elsLines = []) {
    exe_block([
        {
            f: function (s) {
                if (!condition(s)) {
                    s.line += lines.length + 2;
                }
                return s;
            }
        },
        ...lines,
        {
            f: function (s) {
                s.line += elsLines.length + 1;
                return s;
            }
        },
        ...elsLines
    ]);
}

class ExampleExecuter {
    lines;
    state = {
        varsStack: [],
        vars: {
        },
        line: 0
    };
    intervalId;

    constructor(lines){
        this.lines = lines;
    }

    step() {
        var old_l = state.line;
        var f = lines[state.line].f;
        if (f) {
            state = f(state);
        }
        if (old_l === state.line) {
            state.line += 1;
        } else if (typeof state.line === "string") {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].l === state.line) {
                    state.line = i;
                    break;
                }
            }
        }
    };

    nextBreakpoint() {
        do {
            if (state.line == lines.length) {
                end_Algo()
                return
            }
            step();
        } while (!breakpoints.includes(state.line) && state.line !== lines.length);
        zeigeAusgabe()
    }

    play(onlyBreakpoints = true, afterStepFunc = function () { }) {
        intervalId = setInterval(function () {
            if (onlyBreakpoints) {
                nextBreakpoint()
            } else {
                step()
            }
            afterStepFunc()
        }, 100)
    }

    stop() {
        clearInterval(intervalId)
    }
}