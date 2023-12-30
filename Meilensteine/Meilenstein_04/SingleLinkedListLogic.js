function Daten_an_Position_hinzufügen(){
    if(document.getElementById('Daten_an_Position_hinzufügen').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "block";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Daten_von_Position_zurückgeben(){
    if(document.getElementById('Daten_von_Position_zurückgeben').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "block";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Position_von_Daten_zurückgeben(){
    if(document.getElementById('Position_von_Daten_zurückgeben').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "block";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Daten_an_Position_löschen(){
    if(document.getElementById('Daten_an_Position_löschen').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "block";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Liste_invertieren(){
    if(document.getElementById('Liste_invertieren').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "block";
        document.getElementById('Liste_löschen').style.display = "none";
    }
}

function Liste_löschen(){
    if(document.getElementById('Liste_löschen').style.display == "block"){
        hide()
    }else{
        document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
        document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
        document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
        document.getElementById('Daten_an_Position_löschen').style.display = "none";
        document.getElementById('Liste_invertieren').style.display = "none";
        document.getElementById('Liste_löschen').style.display = "block";
    }
}

function hide(){
    document.getElementById('Daten_an_Position_hinzufügen').style.display = "none";
    document.getElementById('Daten_von_Position_zurückgeben').style.display = "none";
    document.getElementById('Position_von_Daten_zurückgeben').style.display = "none";
    document.getElementById('Daten_an_Position_löschen').style.display = "none";
    document.getElementById('Liste_invertieren').style.display = "none";
    document.getElementById('Liste_löschen').style.display = "none";
}