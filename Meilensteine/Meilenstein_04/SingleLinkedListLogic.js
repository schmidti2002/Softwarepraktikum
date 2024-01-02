front = null

function addDataToPosition(){
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

function getDataFromPosition(){
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

function getPositionFromData(){
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

function deleteDataFromPosition(){
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

function invertList(){
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

function deleteList(){
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
