front = null

function Daten_an_Position_hinzufügen(){
    if(document.getElementById('Daten_an_Position_hinzufügen').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "block";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Daten_von_Position_zurückgeben(){
    if(document.getElementById('Daten_von_Position_zurückgeben').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "block";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Position_von_Daten_zurückgeben(){
    if(document.getElementById('Position_von_Daten_zurückgeben').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "block";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Daten_an_Position_löschen(){
    if(document.getElementById('Daten_an_Position_löschen').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "block";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Liste_invertieren(){
    if(document.getElementById('Liste_invertieren').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "block";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Liste_löschen(){
    if(document.getElementById('Liste_löschen').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "block";
    }
}

function hide(){
    document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
    document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
    document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
    document.getElementById('Daten_an_Position_löschen').style.display = "none";
    document.getElementById('Liste_invertieren').style.display = "none";
    document.getElementById('Liste_löschen').style.display = "none";
}

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

function getSize(node) {
    let size = 0;
    let currentNode = node;
    
    while (currentNode !== null) {
        currentNode = currentNode.getNext();
        size++;
    }
    
    return size;
}

function print() {
    let position = 0;
    let currentNode = this.front;
    let outputString = '';
  
    while (currentNode !== null) {
        outputString += `Data at position ${position}: ${currentNode.getData()}<br>`;
        currentNode = currentNode.getNext();
        position++;
    }
  
    // Hier wird die Ausgabe in das HTML-Dokument eingefügt
    document.getElementById('ausgabe').innerHTML = outputString;
}

function addDataAtPosition() {
    var position = parseInt(document.getElementById('position').value);
    var data = document.getElementById('data').value;
    addDataAtPosition_raw(position, data);
}

function visualizeList() {
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
