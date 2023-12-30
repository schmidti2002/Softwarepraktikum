const content = document.getElementById("mainContainer")

loadStartpage()
function loadStartpage(){
    fetch("Startpage.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}

function loadSingleLinkedList(){
    fetch("SingleLinkedList.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}

function loadDirectedUnweightedGraph(){
    fetch("DirectedUnweightedGraph.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}

function loadBubbleSort(){
    fetch("BubbleSort.html")
        .then(response => response.text())
        .then(data => {
            content.innerHTML = data;
            zeigeAusgabe()
        })          
}

function loadMergeSort(){
    fetch("MergeSort.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}


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
