// Tests für sämtliche Logikfunktionen der SLL 

// Test für getSize(node)
function testGetSize() {
    // Erstellen einer verketteten Liste mit drei Knoten
    let head = new Node(1);
    head.setNext(new Node(2));
    head.getNext().setNext(new Node(3));

    // Erwartete Größe der Liste
    let expectedSize = 3;

    // Testen der getSize-Funktion
    let actualSize = getSize(head);

    if (actualSize === expectedSize) {
        console.log('Test für getSize erfolgreich: Erwartete Größe stimmt mit der tatsächlichen Größe überein.');
    } else {
        console.error(`Test für getSize fehlgeschlagen: Erwartete Größe (${expectedSize}), aber tatsächliche Größe war (${actualSize}).`);
    }
}

// Ausführen des Tests
testGetSize();


// Test für addDataAtPosition_raw(position, data)
function testAddDataAtPositionRaw() {
    // Fall 1: Einfügen in eine leere Liste
    let front = null; // Start mit einer leeren Liste
    let testPosition1 = 0;
    let testData1 = 'Erstes Element';

    if (!addDataAtPosition_raw.call({ front }, testPosition1, testData1)) {
        console.error('Test für addDataAtPosition_raw fehlgeschlagen: Konnte nicht in leere Liste einfügen.');
        return;
    }

    if (front.getData() !== testData1) {
        console.error('Test für addDataAtPosition_raw fehlgeschlagen: Erstes Element nicht korrekt eingefügt.');
        return;
    }

    console.log('Test für addDataAtPosition_raw erfolgreich: Erstes Element korrekt in leere Liste eingefügt.');

    // Fall 2: Einfügen in eine nicht leere Liste
    let testPosition2 = 1;
    let testData2 = 'Zweites Element';

    if (!addDataAtPosition_raw.call({ front }, testPosition2, testData2)) {
        console.error('Test für addDataAtPosition_raw fehlgeschlagen: Konnte nicht in nicht leere Liste einfügen.');
        return;
    }

    let currentNode = front;
    for (let i = 0; i < testPosition2; i++) {
        currentNode = currentNode.getNext();
    }

    if (currentNode.getData() !== testData2) {
        console.error(`Test für addDataAtPosition_raw fehlgeschlagen: Zweites Element (${testData2}) nicht an Position (${testPosition2}) gefunden.`);
    } else {
        console.log('Test für addDataAtPosition_raw erfolgreich: Zweites Element korrekt in Liste eingefügt.');
    }
}

// Ausführen des Tests
testAddDataAtPositionRaw();


// Test für getDataFromPosition_raw(position)
function testGetDataFromPositionRaw() {
    // Fall 1: Testen mit einer leeren Liste
    let front = null; // Leere Liste

    let testPositionEmptyList = 0;
    let dataFromEmptyList = getDataFromPosition_raw.call({ front }, testPositionEmptyList);

    if (dataFromEmptyList !== null) {
        console.error(`Test für getDataFromPosition_raw fehlgeschlagen: Nicht-null Wert von leerer Liste erhalten.`);
        return;
    }

    console.log('Test für getDataFromPosition_raw mit leerer Liste erfolgreich.');

    // Fall 2: Testen mit einer nicht leeren Liste
    front = new Node('Erstes Element');
    front.setNext(new Node('Zweites Element'));
    front.getNext().setNext(new Node('Drittes Element'));

    let testPosition = 1; // Gültige Position
    let expectedData = 'Zweites Element'; // Erwartete Daten an dieser Position

    let actualData = getDataFromPosition_raw.call({ front }, testPosition);

    if (actualData !== expectedData) {
        console.error(`Test für getDataFromPosition_raw fehlgeschlagen: Erwartete Daten (${expectedData}) nicht an der Position (${testPosition}) gefunden.`);
        return;
    }

    console.log('Test für getDataFromPosition_raw mit nicht leerer Liste erfolgreich.');
}

// Ausführen des Tests
testGetDataFromPositionRaw();


// Test für getPositionFromData_raw(data)
function testGetPositionFromDataRaw() {
    // Fall 1: Testen mit einer leeren Liste
    let front = null; // Leere Liste

    let testDataEmptyList = 'Beliebiges Element';
    let positionInEmptyList = getPositionFromData_raw.call({ front }, testDataEmptyList);

    if (positionInEmptyList !== -1) {
        console.error(`Test für getPositionFromData_raw fehlgeschlagen: Sollte -1 für eine leere Liste zurückgeben, gab aber ${positionInEmptyList} zurück.`);
        return;
    }

    console.log('Test für getPositionFromData_raw mit leerer Liste erfolgreich.');

    // Fall 2: Testen mit einer nicht leeren Liste
    front = new Node('Erstes Element');
    front.setNext(new Node('Zweites Element'));
    front.getNext().setNext(new Node('Drittes Element'));

    let testDataExists = 'Zweites Element'; // Daten, die in der Liste vorhanden sind
    let expectedPosition = 1; // Erwartete Position der Daten

    let actualPosition = getPositionFromData_raw.call({ front }, testDataExists);

    if (actualPosition !== expectedPosition) {
        console.error(`Test für getPositionFromData_raw fehlgeschlagen: Erwartete Position (${expectedPosition}) nicht für vorhandene Daten (${testDataExists}) gefunden.`);
        return;
    }

    console.log('Test für getPositionFromData_raw mit nicht leerer Liste erfolgreich.');
}

// Ausführen des Tests
testGetPositionFromDataRaw();


// Test für deleteDataFromPosition_raw(position)
function testDeleteDataFromPositionRaw() {
    // Fall 1: Testen mit einer leeren Liste
    let front = null;

    let testPositionEmptyList = 0;
    let successEmptyList = deleteDataFromPosition_raw.call({ front }, testPositionEmptyList);

    if (successEmptyList) {
        console.error('Test für deleteDataFromPosition_raw fehlgeschlagen: Sollte false zurückgeben für leere Liste.');
        return;
    }

    console.log('Test für deleteDataFromPosition_raw mit leerer Liste erfolgreich.');

    // Fall 2: Testen mit einer nicht leeren Liste
    front = new Node('Erstes Element');
    front.setNext(new Node('Zweites Element'));
    front.getNext().setNext(new Node('Drittes Element'));

    let testPosition = 1; // Position des zu löschenden Elements
    let success = deleteDataFromPosition_raw.call({ front }, testPosition);

    if (!success) {
        console.error('Test für deleteDataFromPosition_raw fehlgeschlagen: Konnte Element nicht löschen.');
        return;
    }

    // Überprüfung, ob das Element gelöscht wurde
    let currentPosition = 0;
    let currentNode = front;
    while (currentNode !== null && currentPosition < testPosition) {
        currentNode = currentNode.getNext();
        currentPosition++;
    }

    if (currentNode && currentNode.getData() === 'Zweites Element') {
        console.error('Test für deleteDataFromPosition_raw fehlgeschlagen: Element wurde nicht gelöscht.');
    } else {
        console.log('Test für deleteDataFromPosition_raw mit nicht leerer Liste erfolgreich.');
    }
}

// Ausführen des Tests
testDeleteDataFromPositionRaw();


// Test für invertList_raw()
function testInvertListRaw() {
    // Fall 1: Testen mit einer leeren Liste
    let front = null;

    invertList_raw.call({ front, print: () => {}, visualizeList: () => {} });
    if (front !== null) {
        console.error('Test für invertList_raw fehlgeschlagen: Leere Liste sollte nach der Invertierung leer bleiben.');
        return;
    }
    console.log('Test für invertList_raw mit leerer Liste erfolgreich.');

    // Fall 2: Testen mit einer nicht leeren Liste
    front = new Node('Erstes Element');
    front.setNext(new Node('Zweites Element'));
    front.getNext().setNext(new Node('Drittes Element'));

    // Erstellen einer Kopie der Liste für die spätere Überprüfung
    let originalList = [front.getData(), front.getNext().getData(), front.getNext().getNext().getData()];

    invertList_raw.call({ front, print: () => {}, visualizeList: () => {} });

    // Überprüfung, ob die Liste korrekt invertiert wurde
    let invertedList = [];
    let currentNode = front;
    while (currentNode !== null) {
        invertedList.push(currentNode.getData());
        currentNode = currentNode.getNext();
    }

    if (invertedList[0] !== 'Drittes Element' || invertedList[1] !== 'Zweites Element' || invertedList[2] !== 'Erstes Element') {
        console.error('Test für invertList_raw fehlgeschlagen: Liste wurde nicht korrekt invertiert.');
    } else {
        console.log('Test für invertList_raw mit nicht leerer Liste erfolgreich.');
    }
}

// Ausführen des Tests
testInvertListRaw();


// Test für deleteList_raw()
function testDeleteListRaw() {
    // Fall 1: Testen mit einer anfangs leeren Liste
    let front = null;

    deleteList_raw.call({ front, print: () => {}, visualizeList: () => {} });
    if (front !== null) {
        console.error('Test für deleteList_raw fehlgeschlagen: Leere Liste sollte nach dem Löschen leer bleiben.');
        return;
    }
    console.log('Test für deleteList_raw mit anfangs leerer Liste erfolgreich.');

    // Fall 2: Testen mit einer anfangs nicht leeren Liste
    front = new Node('Erstes Element');
    front.setNext(new Node('Zweites Element'));

    deleteList_raw.call({ front, print: () => {}, visualizeList: () => {} });

    if (front !== null) {
        console.error('Test für deleteList_raw fehlgeschlagen: Nicht leere Liste sollte nach dem Löschen leer sein.');
    } else {
        console.log('Test für deleteList_raw mit anfangs nicht leerer Liste erfolgreich.');
    }
}

// Ausführen des Tests
testDeleteListRaw();