function testRegisterAndLogin() {
  console.log('start register tests');
  const newUserNames = ['knownName', 0, false, '', null];
  const newPasswords = ['knownPassword', 1234567890, 512609582615089265026589234506252071598437190543721059842301, true, null, 'Re4l3s_P455w0rt_0der_5o'];
  const newEmailadrs = NewUserNames.forEach((userName) => {
    NewPasswords.forEach((password) => {
      newEmailaddr.forEach((eMailaddr) => {
        if (!register(userName, password, eMailaddr)) {
          console.log(`Fehler bei (${userName} , ${password} , ${eMailaddr})`);
        }
      });
    });
  });
  console.log('register tests beendet');

  console.log('start login tests');
  console.log("bei 'unknownName oder unknownPassword' soll es einen Fehler geben, weil beides unbekannt ist.'");
  const userNames = ['knownName', 'unknownName', 0, false, '', null];
  const passwords = ['knownPassword', 'unknownPassword', 1234567890, 512609582615089265026589234506252071598437190543721059842301, true, null, 'Re4l3s_P455w0rt_0der_5o'];
  userNames.forEach((userName) => {
    passwords.forEach((password) => {
      if (!login(userName, password)) {
        console.log(`Fehler bei (${userName} , ${password})`);
      }
    });
  });
  console.log('login tests beendet');
}

// testet alle BubbleSort Funktionen
function HelpFunctionsTest() {
  console.log('Hilfsfunktionen Test beginnt');

  // generateRandomNumbers() und generate() werden zsm geprüft
  console.log('generateRandomNumbers() & generate() Test beginnt');
  // "Dumme" Nutzereingaben
  var array = [0, -1, 0.5, 'einString', 'a', '42', Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, true, false, 1, '1,2,3,4,5', 'a,b,c', '1,b,3,d'];
  // länge des Arrays, das erstellt werden soll; Ich habe einfach mal 10 für falsche eingaben Festgelegt
  var solution = [10, 10, 10, 10, 10, 42, 10, 10, 10, 10, 1, 10, 10, 10];
  for (var i = 0; i < array.length; i++) {
    document.getElementById('userInput').value = array[i];
    generateRandomNumbers();
    if (state.vars.arr.length != solution[i]) {
      console.log(`Länge des Arrays stimmt nicht überein! Länge: ${state.vars.arr.length}; richtige Länge :${solution[i]}`);
    } else {
      state.vars.arr.forEach((element) => {
        if (!Number.isInteger(element)) {
          console.log(`${element} ist kein Integer!`);
        } else if (element < 0) {
          console.log(`${element} ist kleiner als 0`);
        }
      });
    }
  }
  console.log('generateRandomNumbers() & generate() Test wurde beendet');
  console.log('');

  // parseArray wird geprüft
  console.log('parseArray() Test beginnt');
  // "Dumme" Nutzereingaben
  var array = [0, -1, 0.5, 'einString', 'a', '42', Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER, true, false, 1, '1,2,3,4,5', 'a,b,c', '1,b,3,d'];
  // Lösungen
  var solution = [[0], [0], [0], [0], [0], [42], [0], [0], [0], [0], [1], [1, 2, 3, 4, 5], [0], [0]];
  for (var i = 0; i < array.length; i++) {
    document.getElementById('Array').value = array[i];
    parseArray();
    if (state.vars.arr != solution[i]) {
      console.log(`Fehler! Array: ${state.vars.arr}; richtig wäre:${solution[i]}`);
    }
  }
  console.log('parseArray() Test wurde beendet');
  console.log('');
  console.log('HilfsfunktionenTest beendet');
}

function ContentOrganizerTest() {
  console.log('ContentOrganizerTest beginnt');

  console.log('BubbleSort Tests');
  loadBubbleSort();
  // Beispielarrays
  var array = [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [50, 35, 40, 17, 30, 45, 5, 20, 25, 10], [12, 9, 0, 5, 13, 27, 42, 3, 2, 1]];
  var solutionPlay = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [5, 10, 17, 20, 25, 30, 35, 40, 45, 50], [0, 1, 2, 3, 5, 9, 12, 13, 27, 42]];
  var solutionNext = [[[1, 2, 3, 4, 5], [4, 5, 3, 2, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 50, 40, 17, 30, 45, 5, 20, 25, 10], [9, 12, 0, 5, 13, 27, 42, 3, 2, 1]],
    [[1, 2, 3, 4, 5], [4, 3, 5, 2, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 50, 17, 30, 45, 5, 20, 25, 10], [9, 0, 12, 5, 13, 27, 42, 3, 2, 1]],
    [[1, 2, 3, 4, 5], [4, 3, 2, 5, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 17, 50, 30, 45, 5, 20, 25, 10], [9, 0, 5, 12, 13, 27, 42, 3, 2, 1]],
    [[1, 2, 3, 4, 5], [4, 3, 2, 1, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 17, 30, 50, 45, 5, 20, 25, 10], [9, 0, 5, 12, 13, 27, 3, 42, 2, 1]],
    [[1, 2, 3, 4, 5], [3, 4, 2, 1, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 17, 30, 45, 50, 5, 20, 25, 10], [9, 0, 5, 12, 13, 27, 3, 2, 42, 1]],
    [[1, 2, 3, 4, 5], [3, 2, 4, 1, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 17, 30, 45, 5, 50, 20, 25, 10], [9, 0, 5, 12, 13, 27, 3, 2, 1, 42]],
    [[1, 2, 3, 4, 5], [3, 2, 1, 4, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 17, 30, 45, 5, 20, 50, 25, 10], [0, 9, 5, 12, 13, 27, 3, 2, 1, 42]],
    [[1, 2, 3, 4, 5], [2, 3, 1, 4, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 17, 30, 45, 5, 20, 25, 50, 10], [0, 5, 9, 12, 13, 27, 3, 2, 1, 42]],
    [[1, 2, 3, 4, 5], [2, 1, 3, 4, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 40, 17, 30, 45, 5, 20, 25, 10, 50], [0, 5, 9, 12, 13, 3, 27, 2, 1, 42]],
    [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [35, 17, 40, 30, 45, 5, 20, 25, 10, 50], [0, 5, 9, 12, 13, 3, 2, 27, 1, 42]]];

  console.log('BubbleSort exec.play() Test startet');
  // prüft ob erwartetes und reales Ergebnis bei exec.play gleich sind
  for (var i = 0; i < array.length; i++) {
    document.getElementById('Array').value = array[i];
    parseArray();
    exec.play();
    if (document.getElementById('Array').value != solutionPlay[i]) {
      console.log(`Fehler bei exec.play()! Beispiel: ${array[i]}; Ergebnis: ${document.getElementById('Array').value}; richtige Lösung: ${solutionPlay[i]}`);
    }
  }
  console.log('BubbleSort exec.play() Test beendet');

  console.log('BubbleSort exec.next() Test startet');
  // prüft ob erwartetes und reales Ergebnis bei exec.next gleich sind
  for (var i = 0; i < array.length; i++) {
    document.getElementById('Array').value = array[i];
    parseArray();
    for (var j = 0; j < solutionNext.length; j++) {
      exec.next();
      if (document.getElementById('Array').value != solutionNext[j][i]) {
        console.log(`Fehler bei exec.next()! Beispiel: ${array[i]}; Schritt ${j}; Ergebnis: ${document.getElementById('Array').value}; richtige Lösung: ${solutionNext[j][i]}`);
      }
    }
  }
  console.log('BubbleSort exec.next() Test beendet');
  console.log('BubbleSort Tests beendet');

  console.log('MergeSort Tests beginnen');
  loadMergeSort();
  // Beispielarrays
  var array = [[1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [1, 1, 1, 1, 1, 1, 1, 1, 1], [50, 35, 40, 17, 30, 45, 5, 20, 25, 10], [12, 9, 0, 5, 13, 27, 42, 3, 2, 1]];
  var solutionPlay = [[1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 1, 1, 1, 1, 1, 1, 1, 1], [5, 10, 17, 20, 25, 30, 35, 40, 45, 50], [0, 1, 2, 3, 5, 9, 12, 13, 27, 42]];
  var solutionNext = [[[1, 2, 3, 4, 5], [[5, 4, 3], [2, 1]], [1, 1, 1, 1, 1, 1, 1, 1, 1], [[50, 35, 40, 17, 30], [45, 5, 20, 25, 10]], [12, 9, 0, 5, 13], [27, 42, 3, 2, 1]]];

  console.log('MergeSort exec.play() Test startet');
  // prüft ob erwartetes und reales Ergebnis bei exec.play gleich sind
  for (var i = 0; i < array.length; i++) {
    document.getElementById('Array').value = array[i];
    parseArray();
    exec.play();
    if (document.getElementById('Array').value != solutionPlay[i]) {
      console.log(`Fehler bei exec.play()! Beispiel: ${array[i]}; Ergebnis: ${document.getElementById('Array').value}; richtige Lösung: ${solutionPlay[i]}`);
    }
  }
  console.log('MergeSort exec.play() Test beendet');

  console.log('MergeSort exec.next() Test startet');
  // prüft ob erwartetes und reales Ergebnis bei exec.next gleich sind
  for (var i = 0; i < array.length; i++) {
    document.getElementById('Array').value = array[i];
    parseArray();
    for (var j = 0; j < solutionNext.length; j++) {
      exec.next();
      if (document.getElementById('Array').value != solutionNext[j][i]) {
        console.log(`Fehler bei exec.next()! Beispiel: ${array[i]}; Schritt ${j}; Ergebnis: ${document.getElementById('Array').value}; richtige Lösung: ${solutionNext[j][i]}`);
      }
    }
  }
  console.log('MergeSort exec.next() Test beendet');
  console.log('MergeSort Tests beendet');
}
