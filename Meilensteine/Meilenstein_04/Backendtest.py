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


def test_user():
    # Datenbank Cursor
    cursor = database.cursor()

    # Erfolgreichenes Einloggen
    login_user = "Admin"
    login_pass = "sdhvbs"

    response = requests.get(
        BASE + "user/login/", data={"username": login_user, "password": login_pass})
    muster = r'^[a-zA-Z0-9]{40}$'
    if (not re.match(muster, response.text())) and response.status_code == 200:
        return False

    # Datenabfrage testen
    response = requests.get(BASE + "user/UserData/",
                            headers={"sessiontoken": response.text()})
    if not test_response(response.json()):
        return False

    # Erfolgreichenes Ausloggen
    response = requests.get(BASE + "user/logout/",
                            headers={"sessiontoken": response.text()})
    if not response.text():
        return False

    # Nutzer Anlegen
    new_user = "User_".join(random.choice(string.ascii_letters) for _ in range(5))
    new_password = "Pass_".join(random.choice(string.ascii_letters) for _ in range(5))
    new_email = "Mail_".join(random.choice(string.ascii_letters) for _ in range(5)).join("@uni.de")

    response = requests.get(BASE + "user/register/", headers={"sessiontoken": SESSIONTOKEN}, 
                            data={"username": new_user, "password": new_password, "Email": new_email})
    if not response.text():
        return False
    else:
        cursor.execute("SELECT * FROM 'user' WHERE username = %s", (new_user))
        if cursor.fetchall()[0][0] is None:
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
