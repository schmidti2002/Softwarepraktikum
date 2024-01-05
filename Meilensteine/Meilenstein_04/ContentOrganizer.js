const content = document.getElementById("mainContainer")

// Startseite fetchen
loadStartpage()
function loadStartpage(){
    fetch("Startpage.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}

// SingleLinkedList fetchen und Standardbeispiel laden
function loadSingleLinkedList(){
    fetch("SingleLinkedList.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data
                addDataAtPosition_raw(0, "A")
                addDataAtPosition_raw(1, "B")
                addDataAtPosition_raw(2, "C")
                print()
            });
}

// DirectedUnweightedGraph fetchen und Standardbeispiel laden
function loadDirectedUnweightedGraph(){
    fetch("DirectedUnweightedGraph.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}

// BubbleSort fetchen und Standardbeispiel laden
function loadBubbleSort(){
    fetch("BubbleSort.html")
        .then(response => response.text())
        .then(data => {
            content.innerHTML = data;
            exec = new Executer(BubbleSortLines);
            exec.outputFunction = () => showOutput();
            exec.state.vars.arr = [50,35,40,15,30,45,5,20,25,10];
            exec.breakpoints = [8];
            exec.outputFunction();
        })          
}

// MergeSort fetchen und Standardbeispiel laden
function loadMergeSort(){
    fetch("MergeSort.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}

// Größe des Containers für das Benutzerprofil anpassen, sodass er sich rechts am Rand öffnet/schließt
showUserEditor()
function showUserEditor() {
    var container = document.getElementById('container');
    var mainContainer = document.getElementById('mainContainer');
    var userEditor = document.getElementById('userEditor');    
    container.style.flexDirection = 'row';
    // Benutzerprofil ist ausgeblendet
    if (mainContainer.style.width == '100%'){
        mainContainer.style.width = '75%';
        userEditor.style.width = '25%';  
        fetch("UserEditor.html")
            .then(response => response.text())
            .then(data => {userEditor.innerHTML = data});
        console.log('Benutzerprofil sollte geöffnet werden');
    }else{   // Benutzerprofil ist eingeblendet
        mainContainer.style.width = '100%';
        userEditor.style.width = '0%';
        userEditor.innerHTML = ""
    }
}
