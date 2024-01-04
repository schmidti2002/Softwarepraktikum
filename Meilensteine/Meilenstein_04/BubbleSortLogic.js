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

function showArray(){
    document.getElementById('Array').value = exec.state.vars.arr;
}

// Funktion bricht das Sortieren
function parseArray(){
    exec.state.vars.arr = document.getElementById('Array').value.split(',');
    showOutput();
}

// JavaScript-Funktion, um n Zufallszahlen zu generieren und anzuzeigen
function generateRandomNumbers() {
    // Die Anzahl der Zufallszahlen vom Benutzer eingeben lassen
    var count = parseInt(document.getElementById('userInput').value);
    generate(count)    
}

function generate(count){    
    // Zufallszahlen initialisieren und anzeigen
    exec.state.vars.arr = []
    for (var i = 0; i < count; i++) {
        var randomNumber = Math.floor(Math.random() * 50) + 1; // Zufallszahlen zwischen 1 und 50
        exec.state.vars.arr.push(randomNumber);
    }
    showOutput()
}

function newValues(){
    if(document.getElementById('newValues').style.display == "block"){
        hide()
    }else{
        document.getElementById('newValues').style.display = "block";
        document.getElementById('editValues').style.display = "none";
        document.getElementById('openSort').style.display = "none";
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

// JavaScript-Funktion, um die Eingabe zu lesen und anzuzeigen
function showOutput() {
    // die Eingabe ausgeben
    var output = document.getElementById('ausgabe');
    output.innerHTML = 'Das Array lautet: ' + exec.state.vars.arr.join(', ');
    if(exec.algo_is_running){
        output.innerHTML += ', Algo läuft in Line:' + exec.state.line
    }
    renderBars();
    return;
}

// Render bars based on array values
function renderBars() {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    for (let i = 0; i < exec.state.vars.arr.length; i++) {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = '20px'; // Adjust width as needed
        bar.style.height = `${exec.state.vars.arr[i] * 10 + 10}px`; // Scale the height
        bar.innerHTML = `<span>${exec.state.vars.arr[i]}</span>`;
        chart.appendChild(bar);
    }
}