import random
import string
import re
import mysql.connector

import requests
BASE = "http://localhost:5000/"
SESSIONTOKEN = "dWLJVHBWIJDSJVIEDBfdjvbh"

host_url = "localhost"
user_name = "user"
password = "password"
Datenbank = "Visaulisierung"

database = mysql.connector.connect(
    host=host_url, user=user_name, passwd=password, db=Datenbank, auth_plugin='mysql_native_password')


def test_response(response):
    # Überprüfen ob Tag in der Json Antwort steht
    if response.json().get("username"):
        return False

    if response.json().get("Email"):
        return False

    if not response.json().get("right"):
        return False

    if not response.json().get("chronik"):
        return False

    if not response.json().get("Favorits"):
        return False
    return True

def test_login():
    userdata = {}
    with open('logins.txt', 'r') as file:
        for line in file:
        # Trennen von Benutzername und Passwort anhand des Leerzeichens
            username, password = line.strip().split(' ')

            # Hinzufügen von Benutzername und Passwort zum Dictionary
            userdata[username] = password
    
    for username, password in userdata.items():
        response = requests.get(
            BASE + "user/login/", data={"username": username, "password": password})
        muster = r'^[a-zA-Z0-9]{40}$'
        if (not re.match(muster, response.text())) and response.status_code == 200:
            return False
    return True

def test_anlegen(cursor):
    userdata = {}
    with open('userdaten.txt', 'r') as file:
        for line in file:
        # Trennen von Benutzername und Passwort anhand des Leerzeichens
            username, password, email = line.strip().split(' ')

            # Hinzufügen von Benutzername und Passwort, Email zum Dictionary
            userdata[username] = (password, email)
    
    for username, data in userdata.items():
        response = requests.get(BASE + "user/register/", headers={"sessiontoken": SESSIONTOKEN}, 
                            data={"username": username, "password": data[username][0], "Email": data[username][1]})
        if not response.text():
            return False
        else:
            cursor.execute("SELECT * FROM 'user' WHERE username = %s", (username))
            if cursor.fetchall()[0][0] is None:
                return False

    # Testen von SQL Injektions
    response = requests.get(BASE + "user/register/", headers={"sessiontoken":SESSIONTOKEN},
			data={"username":"Robert'); DROP TABLE a; --", "password":"Robert'); DROP TABLE a; --",
			"Email":"Robert'); DROP TABLE a; --"})
    if not response.text():
            return False
        else:
            cursor.execute("SELECT * FROM 'user' WHERE username = %s", (username))
            if cursor.fetchall()[0][0] is None:
                return False

    #Testen von mehreren Woertern
    response = requests.get(BASE + "user/register/", headers={"sessiontoken":SESSIONTOKEN},
			data={"username":"Anna Lisa ", "password":"Paul Albert ", "Email":"Nina Paola "})
    if not response.text():
            return False
        else:
            cursor.execute("SELECT * FROM 'user' WHERE username = %s", (username))
            if cursor.fetchall()[0][0] is None:
                return False

    return True


def test_user():
    # Datenbank Cursor
    cursor = database.cursor()

    # Erfolgreichenes Einloggen
    if not test_login():
        return False

    # Datenabfrage testen
    response = requests.get(BASE + "user/UserData/",
                            headers={"sessiontoken": SESSIONTOKEN})
    if not test_response(response.json()):
        return False

    # Erfolgreichenes Ausloggen
    response = requests.get(BASE + "user/logout/",
                            headers={"sessiontoken": SESSIONTOKEN})
    if not response.text():
        return False

    # Nutzer Anlegen
    if not test_anlegen(cursor):
        return False

    return True


def test_apiendpunkte():
    # Login
    response = requests.get(BASE + "user/login/")
    if response.status_code >= 500:
        return False

    # Logout
    response = requests.get(BASE + "user/logout/")
    if response.status_code >= 500:
        return False

    # register
    response = requests.get(BASE + "user/register/")
    if response.status_code >= 500:
        return False

    # UserData
    response = requests.get(BASE + "user/UserData/")
    if response.status_code >= 500:
        return False

    # Sotieralgorithmen
    response = requests.get(BASE + "algo/")
    if response.status_code >= 500:
        return False

    # Liste
    response = requests.get(BASE + "datastruct/list/setValues/")
    if response.status_code >= 500:
        return False
    response = requests.get(BASE + "datastruct/list/getValues/")
    if response.status_code >= 500:
        return False
    response = requests.get(BASE + "datastruct/list/deleteValues/")
    if response.status_code >= 500:
        return False

    # Heap
    response = requests.get(BASE + "datastruct/heap/setValues/")
    if response.status_code >= 500:
        return False
    response = requests.get(BASE + "datastruct/heap/getValues/")
    if response.status_code >= 500:
        return False
    response = requests.get(BASE + "datastruct/heap/deleteValues/")
    if response.status_code >= 500:
        return False
    return True


def test_database():
    db_table = database.cursor()

    db_table.execute("show tables")
    current_tables = {}
    for x in db_table:
        if type(x[0]) is not str:
            current_tables.update({x[0].decode('utf-8'): 1})
        else:
            current_tables.update({x[0]: 1})

    # Prüfen ob alle Tabellen vorhanden sind
    if not current_tables.get("user"):
        return False

    if not current_tables.get("StructMaster"):
        return False

    if not current_tables.get("ListNodes"):
        return False

    if not current_tables.get("HeapNodes"):
        return False

    return True


def test_listabstact():
    cursor = database.cursor()
    # Liste erstellen
    value = 12
    response = requests.get(BASE + "datastruct/list/setValues/",
                            headers={"sessiontoken": SESSIONTOKEN}, data={"Value": value})
    if response.status_code >= 500:
        return False
    else:
        # Abfrage nach einem Value in einer Liste aufgrund der SessionToken
        cursor.execute("SELECT `ListNodes`.`value` FROM `ListNodes` JOIN `user` on `user`.`session_token`= %s JOIN `StructMaster` on `StructMaster`.`user_id`=`user`.`user_id` WHERE `ListNodes`.`value`= %s GROUP BY `ListNodes`.`value`", (SESSIONTOKEN, value))
        if int(cursor.fetchall()[0][0]) != value:
            return False
        

    # Liste erweitern
    struct_id = 2
    response = requests.get(BASE + "datastruct/list/setValues/", headers={
                            "sessiontoken": SESSIONTOKEN}, data={"struct_id": struct_id, "Value": 12})
    if response.status_code >= 500:
        return False
    else:
        cursor.execute("SELECT `ListNodes`.`value` FROM `ListNodes` JOIN `user` on `user`.`session_token`= %s JOIN `StructMaster` on `StructMaster`.`user_id`=`user`.`user_id` WHERE `ListNodes`.`value`= %s AND `StructMaster`.`struct_id`= %s GROUP BY `ListNodes`.`value`",(SESSIONTOKEN, value, struct_id))
        if int(cursor.fetchall()[0][0]) != value:
            return False

    # Liste abfragen
    response = requests.get(BASE + "datastruct/list/getValues/")
    if not response.json():
        return False

    # Liste löschen
    value = 12
    response = requests.get(
        BASE + "datastruct/list/deleteValues/", headers={"sessiontoken": SESSIONTOKEN}, data={"Value": value})
    if response.status_code >= 500:
        return False

    return True


def test_heapabstact():
    cursor = database.cursor()
    # Heap erstellen
    value = 12
    response = requests.get(
        BASE + "datastruct/heap/setValues/", headers={"sessiontoken": SESSIONTOKEN}, data={"Value": value})
    if response.status_code >= 500:
        return False
    else:
        cursor.execute("SELECT `HeapNodes`.`value` FROM `HeapNodes` JOIN `user` on `user`.`session_token`= %s JOIN `StructMaster` on `StructMaster`.`user_id`=`user`.`user_id` WHERE `HeapNodes`.`value`= %s GROUP BY `HeapNodes`.`value`",(SESSIONTOKEN, value))
        if int(cursor.fetchall()[0][0]) != value:
            return False
        
    # Heap erwitern
    value = 12
    struct_id =2
    response = requests.get(
        BASE + "datastruct/heap/setValues/", headers={"sessiontoken": SESSIONTOKEN}, data={"struct_id": struct_id, "Value": value})
    if response.status_code >= 500:
        return False
    else:
        cursor.execute("SELECT `HeapNodes`.`value` FROM `HeapNodes` JOIN `user` on `user`.`session_token`= %s JOIN `StructMaster` on `StructMaster`.`user_id`=`user`.`user_id` WHERE `HeapNodes`.`value`= %s AND `StructMaster`.`struct_id`= %s GROUP BY `HeapNodes`.`value`",(SESSIONTOKEN, value, struct_id))
        if int(cursor.fetchall()[0][0]) != value:
            return False

    # Heap abfragen
    response = requests.get(BASE + "datastruct/heap/getValues/")
    if response.json():
        return False

    # Heap löschen
    value = 12
    response = requests.get(BASE + "datastruct/heap/deleteValues/", headers={"sessiontoken": SESSIONTOKEN}, data={"Value": value})
    if response.status_code >= 500:
        return False

    return True
