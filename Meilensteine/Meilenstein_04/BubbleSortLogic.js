// Algorithmus, der schrittweise ausgeführt wird
BubbleSortLines = [
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

// Array ausgeben, um es zu bearbeiten
function showArray(){
    document.getElementById('Array').value = exec.state.vars.arr;
}

// Funktion zum Einlesen der eigenen Werte
function parseArray(){var inputArray = document.getElementById('Array').value.split(',');
    var integerArray = [];

    for (var i = 0; i < inputArray.length; i++) {
        var integerValue = parseInt(inputArray[i].trim(), 10); // Basis 10 für Dezimalzahlen
        if (!isNaN(integerValue)) {
            integerArray.push(integerValue);
        }
    }

    exec.state.vars.arr = integerArray;
    showOutput();
}

// Funktion, um n einzulesen und n Zufallszahlen zu generieren und anzuzeigen
function generateRandomNumbers() {
    // Die Anzahl der Zufallszahlen vom Benutzer eingeben lassen
    var count = parseInt(document.getElementById('userInput').value);
    generate(count)    
}

// Funktion, um n Zufallszahlen zu generieren
function generate(count){    
    // Zufallszahlen initialisieren und anzeigen
    exec.state.vars.arr = []
    for (var i = 0; i < count; i++) {
        var randomNumber = Math.floor(Math.random() * 50) + 1; // Zufallszahlen zwischen 1 und 50
        exec.state.vars.arr.push(randomNumber);
    }
    showOutput()
}

// Container 'newValues' öffnen/schließen
function newValues(){
    if(document.getElementById('newValues').style.display == "block"){
        hide()
    }else{
        document.getElementById('newValues').style.display = "block";
        document.getElementById('editValues').style.display = "none";
        document.getElementById('openSort').style.display = "none";
    }
}

// Container 'editValues' öffnen/schließen
function editValues(){
    if (document.getElementById('editValues').style.display == "block"){
        hide()
    }else{
        document.getElementById('newValues').style.display = "none";
        document.getElementById('editValues').style.display = "block";
        document.getElementById('openSort').style.display = "none";
    }
}

// Container 'openSort' öffnen/schließen
function openSort(){
    if(document.getElementById('openSort').style.display == "block"){
        hide()
    }else{
        document.getElementById('newValues').style.display = "none";
        document.getElementById('editValues').style.display = "none";
        document.getElementById('openSort').style.display = "block";
    }
}

// Alle Container schließen
function hide(){
    document.getElementById('newValues').style.display = "none";
    document.getElementById('editValues').style.display = "none";
    document.getElementById('openSort').style.display = "none";
}

// Funktion, um das Array auszugeben
function showOutput() {
    // Dieser Teil ist gut zum Debuggen, kann man später vielleicht weglassen
    var output = document.getElementById('ausgabe');
    output.innerHTML = 'Das Array lautet: ' + exec.state.vars.arr.join(', ');
    if(exec.algo_is_running){
        output.innerHTML += ', Algo läuft in Line:' + exec.state.line
    }
    // wichtig
    renderBars();
    return;
}

// Visualisiert Array in Balken-Diagramm auf Canvas
function renderBars() {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';

    for (let i = 0; i < exec.state.vars.arr.length; i++) { // For-Loop erstellt alle Bars
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.width = '20px'; // Skaliere Breite der Bars
        bar.style.height = `${exec.state.vars.arr[i] * 10 + 10}px`; // Skaliere die Höhe der Bars
        bar.innerHTML = `<span>${exec.state.vars.arr[i]}</span>`;
        chart.appendChild(bar);
    }
}