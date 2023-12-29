const content = document.getElementById("mainContainer")

loadStartpage()
function loadStartpage(){
    fetch("Startpage.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}

function loadBubbleSort(){
    fetch("AuD.html")
        .then(response => response.text())
        .then(data => {
            // HTML der ersten Datei in das Container-Element mit der ID "content" einfügen
            content.innerHTML = data;

            // Fetch für die zweite HTML-Datei nach erfolgreicher Laden der ersten Datei
            return fetch("BubbleSort.html");
        })
        .then(response => response.text())
        .then(data => {
            // HTML der zweiten Datei in das Container-Element mit der ID "view" einfügen
            view.innerHTML = data;
            zeigeAusgabe() 
        })     
     
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
