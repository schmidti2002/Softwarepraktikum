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
        return true;
    }

    let currentNode = front;
    for (let currentIndex = 1; currentIndex < position; currentIndex++) {
        currentNode = currentNode.getNext();
    }

    newNode.setNext(currentNode.getNext());
    currentNode.setNext(newNode);
    print()
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