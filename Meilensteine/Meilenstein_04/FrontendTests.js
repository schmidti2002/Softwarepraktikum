function testRegisterAndLogin(){
    console.log("start register tests")
    var newUserNames = ["knownName", 0, false, "", null]
    var newPasswords = ["knownPassword", 1234567890, 512609582615089265026589234506252071598437190543721059842301, true, null, "Re4l3s_P455w0rt_0der_5o"]
    var newEmailadrs = 
    NewUserNames.forEach(userName => {
        NewPasswords.forEach(password => {
            newEmailaddr.forEach( eMailaddr => {
                if(!register(userName, password, eMailaddr)){
                    console.log("Fehler bei (" + userName + " , " + password + " , " + eMailaddr +")")
                }
            })
        })
    });
    console.log("register tests beendet")


    console.log("start login tests")
    console.log("bei 'unknownName oder unknownPassword' soll es einen Fehler geben, weil beides unbekannt ist.'")
    var userNames = ["knownName", "unknownName", 0, false, "", null]
    var passwords = ["knownPassword", "unknownPassword", 1234567890, 512609582615089265026589234506252071598437190543721059842301, true, null, "Re4l3s_P455w0rt_0der_5o"]
    userNames.forEach(userName => {
        passwords.forEach(password => {
            if(!login(userName, password)){
                console.log("Fehler bei (" + userName + " , " + password + ")")
            }
        })
    });
    console.log("login tests beendet")
}

//testet alle BubbleSort Funktionen
function BubbleSortTest(){

    //generateRandomNumbers() und generate() werden zsm geprüft
    console.log("generateRandomNumbers() & generate() Test beginnt")
    //"Dumme" Nutzereingaben
    var array = [0, -1, 0.5, "einString", "a", "42", Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, true, false, 1, "1,2,3,4,5", "a,b,c", "1,b,3,d"]
    //länge des Arrays, das erstellt werden soll; Ich habe einfach mal 10 für falsche eingaben Festgelegt
    var solution = [10, 10, 10, 10, 10, 42, 10, 10, 10, 10, 1, 10, 10, 10];
    for(var i = 0; i < array.length; i++){
        document.getElementById("userInput").value = array[i]
        generateRandomNumbers()
        if(state.vars.arr.length != solution[i]){
            console.log("Länge des Arrays stimmt nicht überein! Länge: " + state.vars.arr.length + "; richtige Länge :" + solution[i]);
        }else{
            state.vars.arr.forEach(element => {
                if(!Number.isInteger(element)){
                    console.log(element + " ist kein Integer!")
                }else{
                    if(element < 0){
                        console.log(element + " ist kleiner als 0")
                    }
                }
            })
        }
    }
    console.log("generateRandomNumbers() & generate() Test wurde beendet")
    console.log("");

    //parseArray wird geprüft
    console.log("parseArray() Test beginnt")
    //"Dumme" Nutzereingaben
    var array = [0, -1, 0.5, "einString", "a", "42", Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, true, false, 1,  "1,2,3,4,5", "a,b,c", "1,b,3,d"]
    //Lösungen
    var solution = [[0],[0],[0],[0],[0],[42],[0],[0],[0],[0],[1],[1,2,3,4,5],[0],[0]];
    for(var i = 0; i < array.length; i++){
        document.getElementById('Array').value = array[i]
        parseArray()
        if(state.vars.arr != solution[i]){
            console.log("Fehler! Array: " + state.vars.arr + "; richtig wäre:" + solution[i])
        }
    }
    console.log("parseArray() Test wurde beendet")
    console.log("")
}

function AlgoExecuterTest(){

    
}

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
    timeout = 500

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

    // Button Play
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

    // Button Pause
    pause() {
        clearInterval(this.intervalId)
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
        this.state.vars.arr = [...this.state.vars.old_arr]
        this.outputFunction()
    }
}
