var arr = [];

// JavaScript-Funktion, um die Eingabe zu lesen und anzuzeigen
function zeigeAusgabe() {
    // Die Eingabe ausgeben
    var ausgabeBereich = document.getElementById('ausgabe');
    ausgabeBereich.innerHTML = 'Das Array lautet: ' +  arr.join(', ');
    return;
}

// JavaScript-Funktion, um n Zufallszahlen zu generieren und anzuzeigen
function generiereZufallszahlen() {
    // Die Anzahl der Zufallszahlen vom Benutzer eingeben lassen
    var anzahl = parseInt(document.getElementById('userInput').value);

    // Zufallszahlen initialisieren und anzeigen
    arr = []
    for (var i = 0; i < anzahl; i++) {
        var zufallszahl = Math.floor(Math.random() * 50) + 1; // Zufallszahl zwischen 1 und 50
        arr.push(zufallszahl);
    }

    zeigeAusgabe()
}

async function bubbleSort() {
    let temp;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let k = 0; k < n - 1 - i; k++) {
            if (arr[k] > arr[k + 1]) {
                temp = arr[k];
                arr[k] = arr[k + 1];
                arr[k + 1] = temp;
                zeigeAusgabe()
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    zeigeAusgabe()
}