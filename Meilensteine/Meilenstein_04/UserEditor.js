split1()
function split1() {
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