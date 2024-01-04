front = null

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

// neuer Kram
function getDataFromPosition() {
    const positionInput = document.getElementById('getDataInput');
    const position = parseInt(positionInput.value);
    
    const listSize = getSize(front);

    if (position >= 0 && position < listSize) {
        // eingegebene Position ist gültig
        const data = getDataFromPosition_raw(position);
        const resultDiv = document.getElementById('getDataResult');

        if (data !== null) {
            resultDiv.innerHTML = `An der Stelle ${position} befindet sich der Wert "${data}".`;
        } else {
            resultDiv.innerHTML = "Es wurden keine Daten für diese Position gefunden!";
        }
    } else {
        // eingegebene Position ist ungültig
        const resultDiv = document.getElementById('getDataResult');
        resultDiv.innerHTML = `Die Position ${position} existiert nicht! Ungültige Position!`;
        console.error("Exception: position is out of list");
    }
}

function getDataFromPosition_raw(position) {
    if (position < 0 || position >= getSize(front)) {
        console.error("Exception: position is out of list");
        return null;
    }

    let currentNode = front;
    for (let currentIndex = 0; currentIndex < position; currentIndex++) {
        currentNode = currentNode.getNext();
    }

    return currentNode.getData();
}

function getPositionFromData() {
    const data = document.getElementById('getPositionInput').value;
    const position = getPositionFromData_raw(data);
    const resultDiv = document.getElementById('getPositionResult');

    if (position !== -1) {
        resultDiv.innerHTML = `Der Wert "${data}" befindet sich an der Stelle ${position}.`;
    } else {
        resultDiv.innerHTML = `Der Wert "${data}" konnte in der Liste nicht gefunden werden!`;
    }
}

function getPositionFromData_raw(data) {
    let currentNode = front;
    let position = 0;

    while (currentNode !== null) {
        if (currentNode.getData() === data) {
            return position;
        }

        currentNode = currentNode.getNext();
        position++;
    }

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
        console.error("Exception: position is out of list");
        return false;
    }

    if (position === 0) {
        front = front.getNext();
        print();
        visualizeList();
        return true;
    }

    let currentNode = front;
    for (let currentIndex = 1; currentIndex < position; currentIndex++) {
        currentNode = currentNode.getNext();
    }

    currentNode.setNext(currentNode.getNext().getNext());
    print();
    visualizeList();
    return true;
}

function invertList_raw() {
    let prev = null;
    let current = front;
    let nextNode;

    while (current !== null) {
        nextNode = current.getNext();
        current.setNext(prev);
        prev = current;
        current = nextNode;
    }

    front = prev;
    print();
    visualizeList();
}

function invertList() {
    invertList_raw();
}

function deleteList_raw() {
    front = null;
    print();
    visualizeList();
}

function deleteList() {
    deleteList_raw();
}