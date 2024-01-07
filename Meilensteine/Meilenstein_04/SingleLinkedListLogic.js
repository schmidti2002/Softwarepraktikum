// Klasse der SingleLinkedList
class SingleLinkedList{
    
    // Konstruktor um SingleLinkedList mit Standardwerten zu laden
    constructor(){
        this.exec = new Executer();
        this.exec.state.vars.front = null;
        this.exec.outputFunction = () => this.showOutput()
        this.addDataAtPositionDirectly(0, "A");
        this.addDataAtPositionDirectly(1, "B");
        this.addDataAtPositionDirectly(2, "C");
        this.addDataAtPositionDirectly(3, "D");
        this.showOutput();
    };

    // Container 'ContainerAddDataAtPosition' öffnen/schließen
    ContainerAddDataAtPosition(){
        if(document.getElementById('ContainerAddDataAtPosition').style.display == "block"){
            this.hide()
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
            this.hide()
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
            this.hide()
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
            this.hide()
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
            this.hide()
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
            this.hide()
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

    /*public boolean addDataAtPosition(int position, String data) {
        if (position < 0 || position > getSize()) {
            System.err.println(
                    "Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: position is out of list");
            return false;
        }
        Node newNode = new Node(data);
        if (position == 0) {
            newNode.setNext(front);
            front = newNode;
            return true;
        }
        Node currentNode = front;
        for (int currentIndex = 1; currentIndex < position; currentIndex++) {
            currentNode = currentNode.getNext();
        }
        newNode.setNext(currentNode.getNext());
        currentNode.setNext(newNode);
        return true;
	}  */

    linesForAddDataAtPosition = [
        //if (position < 0 || position > this.getSize(this.front)) {
        //    console.error("Exception: position is out of list");
        //    return false;
        //}
        { f: function (s) { s.vars.newNode = new Node(s.vars.data); return s; } },
        ...exe_ifElse(s => s.vars.position === 0, [
            { f: function (s) { s.vars.newNode.setNext(s.vars.front); return s; } },
            { f: function (s) { s.vars.front = s.vars.newNode; return s; } },   // Breakpoint            
        ], [
            { f: function (s) { s.vars.currentNode = s.vars.front; return s; } },
            ...exe_for("i", () => 1, s => s.vars.i < s.vars.position, 1, [
                { f: function (s) { s.vars.currentNode = s.vars.currentNode.getNext(); return s; } },
            ]),
            { f: function (s) { s.vars.newNode.setNext(s.vars.currentNode.getNext()); return s; } },
            { f: function (s) { s.vars.currentNode.setNext(s.vars.newNode); return s; } },  //Breakpoint
        ])
    ];

    addDataAtPosition() {        
        if(this.exec.changeAlgo(this.linesForAddDataAtPosition, [], 1, )){
            this.exec.state.vars.position = parseInt(document.getElementById('position0').value);
            this.exec.state.vars.data = document.getElementById('data0').value;
            this.exec.outputFunction = () => this.showOutput()
            this.exec.play();
        }
    }

    addDataAtPositionDirectly(position, data) {
        this.exec.state.vars.position = parseInt(position);        
        document.getElementById('data0').value = data;
        this.exec.state.vars.data = document.getElementById('data0').value;
        document.getElementById('data0').value = "";
        this.exec.forcePlay(this.linesForAddDataAtPosition);
    }

    /*public String getDataAtPosition(int position) {
        if (position < 0 || position >= getSize()) {
            System.err.println(
                    "Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: position is out of list");
            return null;
        }
        Node currentNode = front;
        for (int currentIndex = 0; currentIndex < position; currentIndex++) {
            currentNode = currentNode.getNext();
        }
        return currentNode.getData();
	}*/

    linesForGetDataAtPosition = [
        { f: function (s) { s.vars.currentNode = s.vars.front; return s; } },
        ...exe_for("i", () => 0, s => s.vars.i < s.vars.position, 1, [
            { f: function (s) { s.vars.currentNode = s.vars.currentNode.getNext(); return s; } },
        ]),
        { f: function (s) { s.vars.dataFound = s.vars.currentNode.getData(); return s; } },
    ]

    getDataAtPosition(){
        if(this.exec.changeAlgo(this.linesForGetDataAtPosition, [], 1)){
            this.exec.state.vars.position = parseInt(document.getElementById('position1').value);
            this.exec.state.vars.dataFound = '-1';
            this.exec.outputFunction = () => this.outputData();
            this.exec.play();            
        }
    }

    /*public int getPositionOfData(String data) {
		if (front == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: list is empty");
			return -1;
		}
		Node currentNode = front;
		for (int position = 0; position < getSize(); position++) {
			if (currentNode.getData().equals(data)) {
				return position;
			}
			currentNode = currentNode.getNext();
		}
		System.err.println("Exeption in thread \"main\" java.lang.IOExeption: data not in list");
		return -1;
	}*/

    linesForGetPositionOfData = [        
        { f: function (s) { s.vars.currentNode = s.vars.front; return s; } },
        ...exe_for("i", () => 0, s => s.vars.i < this.getSize(s.vars.front), 1, [
            ...exe_ifElse(s => s.vars.currentNode.getData() === s.vars.data, [
                { f: function (s) { s.vars.positionFound = s.vars.i; return s; } },
                // Return-Statement noch hinzufügen
            ]),
            { f: function (s) { s.vars.currentNode = s.vars.currentNode.getNext(); return s; } },
        ]),        
    ]

    getPositionOfData(){
        if(this.exec.changeAlgo(this.linesForGetPositionOfData, [], 1)){
            this.exec.state.vars.data = document.getElementById('data2').value;
            this.exec.state.vars.positionFound = -1;
            this.exec.outputFunction = () => this.outputPosition();
            this.exec.play();            
        }
    }    

	/*public boolean removeDataAtPosition(int position) {
		if (position < 0 || position >= getSize()) {
			System.err.println(
					"Exeption in thread \"main\" java.lang.ListIndexOutOfBounceExeption: position is out of list");
			return false;
		}
		if (position == 0) {
			front = front.getNext();
			return true;
		}
		Node currentNode = front;
		for (int currentIndex = 1; currentIndex < position; currentIndex++) {
			currentNode = currentNode.getNext();
		}
		currentNode.setNext(currentNode.getNext().getNext());
		return true;
	}*/

    // Auch hier die Return-Statements noch hinzufügen
    linesForRemoveDataAtPosition = [
        ...exe_ifElse(s => s.vars.position === 0, [
            { f: function (s) { s.vars.front = s.vars.front.getNext(); return s; } },
        ], [
            { f: function (s) { s.vars.currentNode = s.vars.front; return s; } },
            ...exe_for("i", () => 1, s => s.vars.i < s.vars.position, 1, [
                { f: function (s) { s.vars.currentNode = s.vars.currentNode.getNext(); return s; } },
            ]),
            { f: function (s) { s.vars.currentNode.setNext(s.vars.currentNode.getNext().getNext()); return s; } },
        ])    
    ]

    removeDataAtPosition(){
        if(this.exec.changeAlgo(this.linesForRemoveDataAtPosition, [], 1)){
            this.exec.state.vars.position = parseInt(document.getElementById('position3').value);
            this.exec.outputFunction = () => this.showOutput();
            this.exec.play();            
        }
    }

    /*public boolean invertList() {
		if (front == null) {
			System.err.println("Exeption in thread \"main\" java.lang.NullPointerExeption: list is empty");
			return false;
		}
		Node newFront = front;
		int size = getSize() - 1;
		for (int i = 0; i < size; i++) {
			newFront = newFront.getNext();
		}
		Node currentNode;
		for (int j = 0; j < size; j++) {
			currentNode = front;
			for (int k = 0; k < size - 1 - j; k++) {
				currentNode = currentNode.getNext();
			}
			currentNode.getNext().setNext(currentNode);
		}
		front.setNext(null);
		front = newFront;
		return true;
	}*/

    // Visualisierung bricht am Breakpoint, muss man sich sowieso nochmal genauer anschauen
    linesForInvertList = [
        { f: function (s) { s.vars.newFront = s.vars.front; return s; } },
        { f: function (s) { s.vars.size = SLL.getSize(s.vars.front) - 1; return s; } },
        ...exe_for("i", () => 0, s => s.vars.i < s.vars.size, 1, [
            { f: function (s) { s.vars.newFront = s.vars.newFront.getNext(); return s; } },
        ]),
        { f: function (s) { s.vars.currentNode = undefined; return s; } },
        ...exe_for("j", () => 0, s => s.vars.j < s.vars.size, 1, [
            { f: function (s) { s.vars.currentNode = s.vars.front; return s; } },
            ...exe_for("k", () => 0, s => s.vars.k < s.vars.size - 1 - s.vars.j, 1, [
                { f: function (s) { s.vars.currentNode = s.vars.currentNode.getNext(); return s; } },   // Breakpoint
            ]),
            { f: function (s) { s.vars.currentNode.getNext().setNext(s.vars.currentNode); return s; } },    
        ]),
        { f: function (s) { s.vars.front.setNext(null); return s; } },
        { f: function (s) { s.vars.front = s.vars.newFront; return s; } },
    ]

    invertList(){
        if(this.exec.changeAlgo(this.linesForInvertList, [], 1)){
            this.exec.outputFunction = () => this.showOutput();
            this.exec.play();            
        }
    }

    /*public void deleteList() {
		this.front = null;
	}*/

    linesForDeleteList = [
        { f: function (s) { s.vars.front = null; return s; } },
    ]

    deleteList(){
        if(this.exec.changeAlgo(this.linesForDeleteList, [], 1)){
            this.exec.outputFunction = () => this.showOutput();
            this.exec.play();            
        }
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

    outputData(){
        //console.log(this.exec.state.vars.dataFound);
        document.getElementById('outputLine').innerHTML = 'Ausgabe-Bereich: Daten ' + this.exec.state.vars.dataFound + ' an Position ' + this.exec.state.vars.position;
    }

    outputPosition(){
        document.getElementById('outputLine').innerHTML = 'Ausgabe-Bereich: Daten ' + this.exec.state.vars.data + ' an Position ' + this.exec.state.vars.positionFound;
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