// Klasse der SingleLinkedList
class SingleLinkedList{
    exec
    
    // Konstruktor
    constructor(){
        this.exec = new Executer();
        this.exec.state.vars.front = null;
        this.exec.outputFunction = () => this.showOutput();
        this.exec.timeout = 100;
        this.exec.outputFunction();
    };

    // Container 'ContainerAddDataAtPosition' öffnen/schließen
    ContainerAddDataAtPosition(){
        if(document.getElementById('ContainerAddDataAtPosition').style.display == "block"){
            hide()
        }else{
            document.getElementById('ContainerAddDataAtPosition').style.display = "block";
            document.getElementById('ContainerGetDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetPositionOfData').style.display = "none";
            document.getElementById('ContainerRemoveDataAtPosition').style.display = "none";
            document.getElementById('ContainerInvertList').style.display = "none";
            document.getElementById('ContainerdeleteList').style.display = "none";
        }
    }

    // Container 'ContainerGetDataAtPosition' öffnen/schließen
    ContainerGetDataAtPosition(){
        if(document.getElementById('ContainerGetDataAtPosition').style.display == "block"){
            hide()
        }else{
            document.getElementById('ContainerAddDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetDataAtPosition').style.display = "block";
            document.getElementById('ContainerGetPositionOfData').style.display = "none";
            document.getElementById('ContainerRemoveDataAtPosition').style.display = "none";
            document.getElementById('ContainerInvertList').style.display = "none";
            document.getElementById('ContainerdeleteList').style.display = "none";
        }
    }

    // Container 'ContainerGetPositionOfData' öffnen/schließen
    ContainerGetPositionOfData(){
        if(document.getElementById('ContainerGetPositionOfData').style.display == "block"){
            hide()
        }else{
            document.getElementById('ContainerAddDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetPositionOfData').style.display = "block";
            document.getElementById('ContainerRemoveDataAtPosition').style.display = "none";
            document.getElementById('ContainerInvertList').style.display = "none";
            document.getElementById('ContainerdeleteList').style.display = "none";
        }
    }

    // Container 'ContainerRemoveDataAtPosition' öffnen/schließen
    ContainerRemoveDataAtPosition(){
        if(document.getElementById('ContainerRemoveDataAtPosition').style.display == "block"){
            hide()
        }else{
            document.getElementById('ContainerAddDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetPositionOfData').style.display = "none";
            document.getElementById('ContainerRemoveDataAtPosition').style.display = "block";
            document.getElementById('ContainerInvertList').style.display = "none";
            document.getElementById('ContainerdeleteList').style.display = "none";
        }
    }

    // Container 'ContainerInvertList' öffnen/schließen
    ContainerInvertList(){
        if(document.getElementById('ContainerInvertList').style.display == "block"){
            hide()
        }else{
            document.getElementById('ContainerAddDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetPositionOfData').style.display = "none";
            document.getElementById('ContainerRemoveDataAtPosition').style.display = "none";
            document.getElementById('ContainerInvertList').style.display = "block";
            document.getElementById('ContainerdeleteList').style.display = "none";
        }
    }

    // Container 'ContainerdeleteList' öffnen/schließen
    ContainerdeleteList(){
        if(document.getElementById('ContainerdeleteList').style.display == "block"){
            hide()
        }else{
            document.getElementById('ContainerAddDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetDataAtPosition').style.display = "none";
            document.getElementById('ContainerGetPositionOfData').style.display = "none";
            document.getElementById('ContainerRemoveDataAtPosition').style.display = "none";
            document.getElementById('ContainerInvertList').style.display = "none";
            document.getElementById('ContainerdeleteList').style.display = "block";
        }
    }

    // Alle Container schließen
    hide(){
        document.getElementById('ContainerAddDataAtPosition').style.display = "none";
        document.getElementById('ContainerGetDataAtPosition').style.display = "none";
        document.getElementById('ContainerGetPositionOfData').style.display = "none";
        document.getElementById('ContainerRemoveDataAtPosition').style.display = "none";
        document.getElementById('ContainerInvertList').style.display = "none";
        document.getElementById('ContainerdeleteList').style.display = "none";
    }

    /*
    addDataAtPosition_raw(position, data) {
        if (position < 0 || position > this.getSize(this.front)) {
            console.error("Exception: position is out of list");
            return false;
        }

        const newNode = new Node(data);

        if (position === 0) {
            newNode.setNext(this.front);
            this.front = newNode;
            this.print()
            this.visualizeList();
            return true;
        }

        let currentNode = this.front;
        for (let currentIndex = 1; currentIndex < position; currentIndex++) {
            currentNode = currentNode.getNext();
        }

        newNode.setNext(currentNode.getNext());
        currentNode.setNext(newNode);
        this.print()
        this.visualizeList();
        return true;
    }  */

    linesForAddDataAtPosition = [
        //if (position < 0 || position > this.getSize(this.front)) {
        //    console.error("Exception: position is out of list");
        //    return false;
        //}
        { f: function (s) { s.vars.newNode = new Node(data); return s; } },
        ...exe_ifElse(s => s.vars.position === 0, [
            { f: function (s) { s.vars.newNode.setNext(s.vars.front); return s; } },
            { f: function (s) { s.vars.front = s.vars.newNode; return s; } },   // Breakpoint            
        ], [
            { f: function (s) { s.vars.currentNode = s.vars.front; return s; } },
            ...exe_for("i", () => 1, s => s.vars.i < s.vars.position - 1, 1, [
                { f: function (s) { s.vars.currentNode = s.vars.currentNode.getNext(); return s; } },
            ]),
            { f: function (s) { s.vars.newNode.setNext(s.vars.currentNode.getNext()); return s; } },
            { f: function (s) { s.vars.currentNode.setNext(s.vars.newNode); return s; } },  //Breakpoint
        ])
    ];

    addDataAtPosition() {
        this.exec.state.vars.position = parseInt(document.getElementById('position').value);
        this.exec.state.vars.data = document.getElementById('data').value;
        this.exec.lines = this.linesForAddDataAtPosition;
        this.exec.play();
    }

    getSize(node) {
        let size = 0;
        let currentNode = node;
        
        while (currentNode !== null) {
            currentNode = currentNode.getNext();
            size++;
        }
        
        return size;
    }

    showOutput(){
        this.print();
        this.visualizeList();
    }

    print() {
        let position = 0;
        let currentNode = this.exec.state.vars.front;
        let outputString = '';
    
        while (currentNode !== null) {
            outputString += `Data at position ${position}: ${currentNode.getData()}<br>`;
            currentNode = currentNode.getNext();
            position++;
        }
    
        // Hier wird die Ausgabe in das HTML-Dokument eingefügt
        document.getElementById('ausgabe').innerHTML = outputString;
    }

    visualizeList() {
        const graphContainer = document.getElementById('graph');
        graphContainer.innerHTML = '';

        let currentNode = this.exec.state.vars.front;
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
}

// Node-Klasse 
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