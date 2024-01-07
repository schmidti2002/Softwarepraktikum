// Klasse für den BubbleSort
class BubbleSort{

    // Konstruktor
    constructor(){
        this.exec = new Executer();
        this.exec.changeAlgo(this.linesForBubbleSort, [8], 10);
        this.exec.state.vars.arr = [50,35,40,15,30,45,5,20,25,10];        
        this.exec.outputFunction = () => this.showOutput();
        this.exec.outputFunction();
    };

    // Algorithmus, der schrittweise ausgeführt wird
    linesForBubbleSort = [
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
    showArray(){
        document.getElementById('Array').value = this.exec.state.vars.arr;
    }

    // Funktion zum Einlesen der eigenen Werte
    parseArray(){var inputArray = document.getElementById('Array').value.split(',');
        var integerArray = [];

        for (var i = 0; i < inputArray.length; i++) {
            var integerValue = parseInt(inputArray[i].trim(), 10); // Basis 10 für Dezimalzahlen
            if (!isNaN(integerValue)) {
                integerArray.push(integerValue);
            }
        }

        this.exec.state.vars.arr = integerArray;
        this.showOutput();
    }

    // Funktion, um n einzulesen und n Zufallszahlen zu generieren und anzuzeigen
    generateRandomNumbers() {
        // Die Anzahl der Zufallszahlen vom Benutzer eingeben lassen
        var count = parseInt(document.getElementById('userInput').value);
        this.generate(count);
    }

    // Funktion, um n Zufallszahlen zu generieren
    generate(count){    
        // Zufallszahlen initialisieren und anzeigen
        this.exec.state.vars.arr = []
        for (var i = 0; i < count; i++) {
            var randomNumber = Math.floor(Math.random() * 50) + 1; // Zufallszahlen zwischen 1 und 50
            this.exec.state.vars.arr.push(randomNumber);
        }
        this.showOutput()
    }

    // Container 'newValues' öffnen/schließen
    newValues(){
        if(document.getElementById('newValues').style.display == "block"){
            this.hide()
        }else{
            document.getElementById('newValues').style.display = "block";
            document.getElementById('editValues').style.display = "none";
            document.getElementById('openSort').style.display = "none";
        }
    }

    // Container 'editValues' öffnen/schließen
    editValues(){
        if (document.getElementById('editValues').style.display == "block"){
            this.hide()
        }else{
            document.getElementById('newValues').style.display = "none";
            document.getElementById('editValues').style.display = "block";
            document.getElementById('openSort').style.display = "none";
        }
    }

    // Container 'openSort' öffnen/schließen
    openSort(){
        if(document.getElementById('openSort').style.display == "block"){
            this.hide()
        }else{
            document.getElementById('newValues').style.display = "none";
            document.getElementById('editValues').style.display = "none";
            document.getElementById('openSort').style.display = "block";
        }
    }

    // Alle Container schließen
    hide(){
        document.getElementById('newValues').style.display = "none";
        document.getElementById('editValues').style.display = "none";
        document.getElementById('openSort').style.display = "none";
    }

    // Funktion, um das Array auszugeben
    showOutput() {
        // Dieser Teil ist gut zum Debuggen, kann man später vielleicht weglassen
        var output = document.getElementById('ausgabe');
        output.innerHTML = 'Das Array lautet: ' + this.exec.state.vars.arr.join(', ');
        if(!this.exec.state.vars == -1){
            output.innerHTML += ', Algo läuft in Line:' + this.exec.state.currentLine
        }
        // wichtig
        this.renderBars();
        return;
    }

    // Visualisiert Array in Balken-Diagramm auf Canvas
    renderBars() {
        const chart = document.getElementById('chart');
        chart.innerHTML = '';

        for (let i = 0; i < this.exec.state.vars.arr.length; i++) { // For-Loop erstellt alle Bars
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.width = '20px'; // Skaliere Breite der Bars
            bar.style.height = `${this.exec.state.vars.arr[i] * 10 + 10}px`; // Skaliere die Höhe der Bars
            bar.innerHTML = `<span>${this.exec.state.vars.arr[i]}</span>`;
            chart.appendChild(bar);
        }
    }
}