const content = document.getElementById("mainContainer")

loadTutorial()
function loadTutorial(){
    fetch("Tutorial_Container.html")
            .then(response => response.text())
            .then(data => {content.innerHTML = data});
}