function showArray(){
    document.getElementById('Array').value = state.vars.arr;
}

function parseArray(){
    state.vars.arr = document.getElementById('Array').value.split(',');
    zeigeAusgabe();
}

// JavaScript-Funktion, um die Eingabe zu lesen und anzuzeigen
function zeigeAusgabe() {
    // Die Eingabe ausgeben
    var ausgabeBereich = document.getElementById('ausgabe');
    ausgabeBereich.innerHTML = 'Das Array lautet: ' +  state.vars.arr.join(', ');
    return;
}

// JavaScript-Funktion, um n Zufallszahlen zu generieren und anzuzeigen
function generiereZufallszahlen() {
    // Die Anzahl der Zufallszahlen vom Benutzer eingeben lassen
    var anzahl = parseInt(document.getElementById('userInput').value);
    generiere(anzahl)    
}

function generiere(anzahl){    
    // Zufallszahlen initialisieren und anzeigen
    state.vars.arr = []
    for (var i = 0; i < anzahl; i++) {
        var zufallszahl = Math.floor(Math.random() * 50) + 1; // Zufallszahl zwischen 1 und 50
        state.vars.arr.push(zufallszahl);
    }
    zeigeAusgabe()
}

function Neue_Werte(){
    if(document.getElementById('Neue_Werte').style.display == "block"){
        hide()
    }else{
        document.getElementById('Neue_Werte').style.display = "block";
        document.getElementById('Werte_bearbeiten').style.display = "none";
        document.getElementById('Algo_abspielen').style.display = "none";
    }
}

function Werte_bearbeiten(){
    if (document.getElementById('Werte_bearbeiten').style.display == "block"){
        hide()
    }else{
        document.getElementById('Neue_Werte').style.display = "none";
        document.getElementById('Werte_bearbeiten').style.display = "block";
        document.getElementById('Algo_abspielen').style.display = "none";
    }
}

function Algo_abspielen(){
    if(document.getElementById('Algo_abspielen').style.display == "block"){
        hide()
    }else{
        document.getElementById('Neue_Werte').style.display = "none";
        document.getElementById('Werte_bearbeiten').style.display = "none";
        document.getElementById('Algo_abspielen').style.display = "block";
    }
}

function hide(){
    document.getElementById('Neue_Werte').style.display = "none";
    document.getElementById('Werte_bearbeiten').style.display = "none";
    document.getElementById('Algo_abspielen').style.display = "none";
}

var state = {
    vars: {
    },
    line: 0
}

/*async function bubbleSort() {
    let temp;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let k = 0; k < n - 1 - i; k++) {
            if (arr[k] > arr[k + 1]) {
                temp = arr[k];
                arr[k] = arr[k + 1];
                arr[k + 1] = temp;
                zeigeAusgabe()
                console.log(locked)
                while(locked == true){
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                locked = true;
                
            }
        }
    }
    zeigeAusgabe()
}*/

lines = [
    {f: function(s){s.vars.temp = undefined; return s;}},
    {f: function(s){s.vars.n = s.vars.arr.length; return s;}},
    {l: "f_i", f: function(s){
            if(s.vars.i === undefined)
                s.vars.i = 0;
            return s;
        }},
    {l: "f_k", f: function(s){
            if(s.vars.k === undefined)
                s.vars.k = 0;
            return s;
        }},
    {f: function(s){
            if(s.vars.arr[s.vars.k] < s.vars.arr[s.vars.k + 1])
                s.line="end_i_arr";
            return s;
        }},
    {f: function(s){s.vars.temp = s.vars.arr[s.vars.k]; return s;}},
    {f: function(s){s.vars.arr[s.vars.k] = s.vars.arr[s.vars.k + 1]; return s;}},
    {f: function(s){s.vars.arr[s.vars.k + 1] = s.vars.temp; return s;}},
    {l: "end_i_arr"},
    {f: function(s){
        s.vars.k += 1;
        if(s.vars.k < s.vars.n - 1 - s.vars.i){
            s.line = "f_k";
        }else{
            s.vars.k = undefined;
        }
        return s;}},
    {f: function(s){
        s.vars.i += 1;
        if(s.vars.i < s.vars.n - 1){
            s.line = "f_i";
        }else
            s.vars.i = undefined;
        return s;}}
];

function step(){
    var old_l = state.line;
    var f = lines[state.line].f;
    if(f){
        state = f(state);
    }
    if(old_l === state.line){
        state.line += 1;
    }else if(typeof state.line === "string"){
        for (let i = 0; i < lines.length; i++) {
            if(lines[i].l === state.line){
                state.line = i;
                break;
            }
        }
    }
    //console.log(JSON.stringify(state));
};

function nextBreakpoint(){
    do {
        if(state.line == lines.length){
            end_Algo()
            return
        }
        step();
    } while (!breakpoints.includes(state.line) && state.line !== lines.length);
    zeigeAusgabe()
}
/*
async function bubbleSort(){
    while(state.line !== lines.length){
        nextBreakpoint();
        zeigeAusgabe()
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    zeigeAusgabe()
}
*/


state.vars.arr = [33,15,3,11,50,26,46,10];
state.vars.old_arr = [33,15,3,11,50,26,46,10];
state.vars.algo_is_running = false;
//state.vars.arr = [];
breakpoints = [8];

var intervalId;
function play(){
    start_Algo()
    intervalId = setInterval(function(){nextBreakpoint()},100)
}

function stop(){
    clearInterval(intervalId)
    zeigeAusgabe()
}

function next(){
    start_Algo()
    stop()
    nextBreakpoint()
}

function reset_Algo(){
    end_Algo()
    state.vars.arr = [...state.vars.old_arr];
    zeigeAusgabe()
}

function start_Algo(){
    if (!state.vars.algo_is_running){
        state.line = 0;
        state.vars.old_arr = [...state.vars.arr];
        state.vars.algo_is_running = true
    }
}

function end_Algo(){
    stop()
    state.vars.algo_is_running = false
    zeigeAusgabe()
}

function full_reset(){
    reset_Algo()
    state.vars.arr = [33,15,3,11,50,26,46,10];
    state.vars.old_arr = [33,15,3,11,50,26,46,10];
    zeigeAusgabe()
}