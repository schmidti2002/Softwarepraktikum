function showArray(){
    document.getElementById('Array').value = state.vars.arr;
}

function parseArray(){
    state.vars.arr = document.getElementById('Array').value.split(',');
    showOutput();
}

// JavaScript-Funktion, um die Eingabe zu lesen und anzuzeigen
function showOutput() {
    // die Eingabe ausgeben
    var output = document.getElementById('ausgabe');
    output.innerHTML = 'Das Array lautet: ' +  state.vars.arr.join(', ');
    renderBars();
    return;
}

// JavaScript-Funktion, um n Zufallszahlen zu generieren und anzuzeigen
function generateRandomNumbers() {
    // Die Anzahl der Zufallszahlen vom Benutzer eingeben lassen
    var count = parseInt(document.getElementById('userInput').value);
    generate(count)    
}

function generate(count){    
    // Zufallszahlen initialisieren und anzeigen
    state.vars.arr = []
    for (var i = 0; i < count; i++) {
        var randomNumber = Math.floor(Math.random() * 50) + 1; // Zufallszahlen zwischen 1 und 50
        state.vars.arr.push(randomNumber);
    }
    showOutput()
}

function newValues(){
    if(document.getElementById('newValues').style.display == "block"){
        hide()
    }else{
        document.getElementById('newValues').style.display = "block";
        document.getElementById('editValues').style.display = "none";
        document.geSorttElementById('openSort').style.display = "none";
    }
}

function editValues(){
    if (document.getElementById('editValues').style.display == "block"){
        hide()
    }else{
        document.getElementById('newValues').style.display = "none";
        document.getElementById('editValues').style.display = "block";
        document.getElementById('openSort').style.display = "none";
    }
}

function openSort(){
    if(document.getElementById('openSort').style.display == "block"){
        hide()
    }else{
        document.getElementById('newValues').style.display = "none";
        document.getElementById('editValues').style.display = "none";
        document.getElementById('openSort').style.display = "block";
    }
}

function hide(){
    document.getElementById('newValues').style.display = "none";
    document.getElementById('editValues').style.display = "none";
    document.getElementById('openSort').style.display = "none";
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
                showOutput()
                console.log(locked)
                while(locked == true){
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                locked = true;
                
            }
        }
    }
    showOutput()
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
    showOutput()
}

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
    showOutput()
}

function next(){
    start_Algo()
    stop()
    nextBreakpoint()
}

function reset_Algo(){
    end_Algo()
    state.vars.arr = [...state.vars.old_arr];
    showOutput()
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
    showOutput()
}

function fullReset(){
    reset_Algo()
    state.vars.arr = [33,15,3,11,50,26,46,10];
    state.vars.old_arr = [33,15,3,11,50,26,46,10];
    showOutput()
}

// Render bars based on array values
function renderBars() {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    for (let i = 0; i < state.vars.arr.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = '20px'; // Adjust width as needed
        bar.style.height = `${state.vars.arr[i] * 10 + 10}px`; // Scale the height
        bar.innerHTML = `<span>${state.vars.arr[i]}</span>`;
        chart.appendChild(bar);
    }
}