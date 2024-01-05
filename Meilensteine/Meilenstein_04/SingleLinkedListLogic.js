front = null

// Displayer-Funktionen:
// steuern die Anzeige der Bedienflächen für die SLL
function addDataAtPositionDisplayer(){
    if(document.getElementById('addDataToPosition').style.display == "block"){
        hide()
    }else{
        document.getElementById('addDataToPosition').style.display = "block";
        document.getElementById('getDataFromPosition').style.display = "none";
        document.getElementById('getPositionFromData').style.display = "none";
        document.getElementById('deleteDataFromPosition').style.display = "none";
        document.getElementById('invertList').style.display = "none";
        document.getElementById('deleteList').style.display = "none";
    }
}

function getDataFromPositionDisplayer(){
    if(document.getElementById('getDataFromPosition').style.display == "block"){
        hide()
    }else{
        document.getElementById('addDataToPosition').style.display = "none";
        document.getElementById('getDataFromPosition').style.display = "block";
        document.getElementById('getPositionFromData').style.display = "none";
        document.getElementById('deleteDataFromPosition').style.display = "none";
        document.getElementById('invertList').style.display = "none";
        document.getElementById('deleteList').style.display = "none";
    }
}

function getPositionFromDataDisplayer(){
    if(document.getElementById('getPositionFromData').style.display == "block"){
        hide()
    }else{
        document.getElementById('addDataToPosition').style.display = "none";
        document.getElementById('getDataFromPosition').style.display = "none";
        document.getElementById('getPositionFromData').style.display = "block";
        document.getElementById('deleteDataFromPosition').style.display = "none";
        document.getElementById('invertList').style.display = "none";
        document.getElementById('deleteList').style.display = "none";
    }
}

function deleteDataFromPositionDisplayer(){
    if(document.getElementById('deleteDataFromPosition').style.display == "block"){
        hide()
    }else{
        document.getElementById('addDataToPosition').style.display = "none";
        document.getElementById('getDataFromPosition').style.display = "none";
        document.getElementById('getPositionFromData').style.display = "none";
        document.getElementById('deleteDataFromPosition').style.display = "block";
        document.getElementById('invertList').style.display = "none";
        document.getElementById('deleteList').style.display = "none";
    }
}

function invertListDisplayer(){
    if(document.getElementById('invertList').style.display == "block"){
        hide()
    }else{
        document.getElementById('addDataToPosition').style.display = "none";
        document.getElementById('getDataFromPosition').style.display = "none";
        document.getElementById('getPositionFromData').style.display = "none";
        document.getElementById('deleteDataFromPosition').style.display = "none";
        document.getElementById('invertList').style.display = "block";
        document.getElementById('deleteList').style.display = "none";
    }
}

function deleteListDisplayer(){
    if(document.getElementById('deleteList').style.display == "block"){
        hide()
    }else{
        document.getElementById('addDataToPosition').style.display = "none";
        document.getElementById('getDataFromPosition').style.display = "none";
        document.getElementById('getPositionFromData').style.display = "none";
        document.getElementById('deleteDataFromPosition').style.display = "none";
        document.getElementById('invertList').style.display = "none";
        document.getElementById('deleteList').style.display = "block";
    }
}

function hide(){
    document.getElementById('addDataToPosition').style.display = "none";
    document.getElementById('getDataFromPosition').style.display = "none";
    document.getElementById('getPositionFromData').style.display = "none";
    document.getElementById('deleteDataFromPosition').style.display = "none";
    document.getElementById('invertList').style.display = "none";
    document.getElementById('deleteList').style.display = "none";
}

// SLL:
class Node {
    // Möglicherweise sollte die Möglichkeit bestehen,
    // sich diese Klasse irgendwo anzeigen zu lassen
  
    constructor(data) {
        this.data = data;
        this.next = null;
    }
  
    getData() {
        return this.data;
    }
  
    setData(data) {
        this.data = data;
    }
  
    getNext() {
        return this.next;
    }
  
    setNext(next) {
        this.next = next;
    }
}

// Logik-Funktionen:
function getSize(node) {
    let size = 0;
    let currentNode = node;
    
    while (currentNode !== null) {
        currentNode = currentNode.getNext();
        size++;
    }
    
    return size;
}

function addDataAtPosition() {
    var position = parseInt(document.getElementById('position').value);
    var data = document.getElementById('data').value;
    addDataAtPosition_raw(position, data);
}

function addDataAtPosition_raw(position, data) {
    if (position < 0 || position > getSize(front)) {
        console.error("Exception: position is out of list");
        return false;
    }

    const newNode = new Node(data);

    if (position === 0) {
        newNode.setNext(front);
        front = newNode;
        print()
        visualizeList();
        return true;
    }

    let currentNode = front;
    for (let currentIndex = 1; currentIndex < position; currentIndex++) {
        currentNode = currentNode.getNext();
    }

    newNode.setNext(currentNode.getNext());
    currentNode.setNext(newNode);
    print()
    visualizeList();
    return true;
}

function getDataFromPosition() {
    const positionInput = document.getElementById('getDataInput');
    const position = parseInt(positionInput.value);
    
    const listSize = getSize(front);

    if (position >= 0 && position < listSize) {
        // Eingegebene Position ist in Liste vorhanden
        const data = getDataFromPosition_raw(position);
        const resultDiv = document.getElementById('getDataResult');

        if (data !== null) {
            resultDiv.innerHTML = `An der Stelle ${position} befindet sich der Wert "${data}".`;
        } else {
            resultDiv.innerHTML = "Es wurden keine Daten für diese Position gefunden!";
        }
    } else {
        // Eingegebene Position ist NICHT in Liste vorhanden
        console.error("Exception: position is out of list");
        const resultDiv = document.getElementById('getDataResult');
        resultDiv.innerHTML = `Die Position ${position} existiert nicht! Ungültige Position!`;
    }
}

function getDataFromPosition_raw(position) {
    if (position < 0 || position >= getSize(front)) {
        // Eingegebene Position ist NICHT in Liste vorhanden
        return null;
    }

    let currentNode = front;
    for (let currentIndex = 0; currentIndex < position; currentIndex++) { // For-Loop bis eingegebene Position
        currentNode = currentNode.getNext();
    }

    return currentNode.getData();
}

function getPositionFromData() {
    const data = document.getElementById('getPositionInput').value;
    const position = getPositionFromData_raw(data);
    const resultDiv = document.getElementById('getPositionResult');

    if (position !== -1) {
        // Wert befindet sich in Liste
        resultDiv.innerHTML = `Der Wert "${data}" befindet sich an der Stelle ${position}.`;
    } else {
        // Wert befindet sich NICHT in Liste; Error kam bereits
        resultDiv.innerHTML = `Der Wert "${data}" konnte in der Liste nicht gefunden werden!`;
    }
}

function getPositionFromData_raw(data) {
    let currentNode = front;
    let position = 0;

    while (currentNode !== null) { // Durchgang aller Knoten
        if (currentNode.getData() === data) {
            // Gesuchter Wert wurde in einem Knoten gefunden -> Rückgabe
            return position;
        }

        currentNode = currentNode.getNext();
        position++;
    }

    // Knoten mit gesuchtem Wert existiert nicht
    console.error("Exception: data not found in list");
    return -1;
}

function deleteDataFromPosition() {
    const positionInput = document.getElementById('deleteDataInput');
    const position = parseInt(positionInput.value);

    const resultDiv = document.getElementById('deleteDataResult');
    const success = deleteDataFromPosition_raw(position);

    if (success) {
        resultDiv.innerHTML = `Der Wert an der Position ${position} wurde erfolgreich gelöscht.`;
    } else {
        resultDiv.innerHTML = `Der Wert an der Position ${position} konnte nicht gelöscht werden! Ungültige Position!`;
    }
}

function deleteDataFromPosition_raw(position) {
    if (position < 0 || position >= getSize(front)) {
        // Position existiert nicht in Liste
        console.error("Exception: position is out of list");
        return false;
    }

    if (position === 0) {
        // Randfall -> Head soll gelöscht werden
        front = front.getNext();
        print();
        visualizeList();
        return true;
    }

    let currentNode = front;
    for (let currentIndex = 1; currentIndex < position; currentIndex++) { // For-Loop zu eingegebener Position
        currentNode = currentNode.getNext();
    }

    currentNode.setNext(currentNode.getNext().getNext()); // Löschen des Knotens
    print();
    visualizeList();
    return true;
}

function invertList() {
    invertList_raw();
}

function invertList_raw() {
    let prev = null;
    let current = front;
    let nextNode;

    while (current !== null) { // Standardinvertierung; sollte noch für gute Animation für Visualisierung aktualisiert werden
        nextNode = current.getNext();
        current.setNext(prev);
        prev = current;
        current = nextNode;
    }

    front = prev;
    print();
    visualizeList();
}

function deleteList() {
    deleteList_raw();
}

function deleteList_raw() {
    front = null;
    print();
    visualizeList();
}

// Ausgabe-Funktionen:
function print() {
    let position = 0;
    let currentNode = this.front;
    let outputString = '';
  
    while (currentNode !== null) {
        outputString += `Wert an Position ${position}: ${currentNode.getData()}<br>`;
        currentNode = currentNode.getNext();
        position++;
    }
  
    // Einfügen der Ausgabe in das HTML-Dokument
    document.getElementById('ausgabe').innerHTML = outputString;
}

function visualizeList() { // eigentliche Visualisierung der Liste; benötigt noch einige Änderung -> mehrere Visu.-Funktionen für alle SLL-Manipulationen nötig
    const graphContainer = document.getElementById('graph');
    graphContainer.innerHTML = '';

    let currentNode = front;
    let position = 0;

    while (currentNode !== null) {
        const nodeElement = document.createElement('div');
        nodeElement.classList.add('node');
        nodeElement.innerText = currentNode.getData();

        // Setze die Position des Knotens basierend auf der Position
        nodeElement.style.left = `${(position * 90) + 50}px`; // Abstand zwischen den Knoten: 60px, Start bei 50px
        nodeElement.style.top = '50px'; // Abstand vom oberen Rand: 50px

        graphContainer.appendChild(nodeElement);

        // Verbindungspfeile zwischen den Knoten auf der Höhe der Knoten
        if (position > 0) {
            // Erstelle das Rechteck (Pfeilkörper)
            const arrowElement = document.createElement('div');
            arrowElement.classList.add('arrow');
            arrowElement.style.left = `${(position * 90) + 0}px`; // Position der Mitte zwischen den Knoten
            arrowElement.style.top = '70px'; // Setze die Höhe des Pfeils auf 70px (oder nach Bedarf)
            graphContainer.appendChild(arrowElement);

            // Erstelle das Dreieck (Pfeilspitze)
            const arrowTipElement = document.createElement('div');
            arrowTipElement.classList.add('arrow_tip');
            arrowElement.appendChild(arrowTipElement);

            graphContainer.appendChild(arrowElement);
        }

        currentNode = currentNode.getNext();
        position++;
    }

    // Zeige den Graphen an
    graphContainer.style.display = 'flex';
}

