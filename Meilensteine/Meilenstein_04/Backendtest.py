import random
import re
import mysql.connector

import requests
BASE = "http://localhost:5000/"

host_url="localhost"
user_name="user"
password="password"
Datenbank="Visaulisierung"

database = mysql.connector.connect(host=host_url,user=user_name,passwd=password,db=Datenbank,auth_plugin='mysql_native_password')

def test_response(response):
    if response.json()("username") != "Herbert":
        return False
    
    if response.json()("Email") != "Admin@test.de":
        return False
    
    if not response.json()("right"):
        return False
    
    if not (response("chronik")(1) == 1 and response("chronik")(2) == 2 and response("chronik")(3) == 3):
        return False
    
    if not (response("Favorits")(1) == 1 and response("Favorits")(2) == 2 and response("Favorits")(3) == 3):
        return False
    return True

def test_token():
    # Erfolgreichenes Einloggen
    response = requests.get(BASE + "user/login/",data={"username": "Admin","password":"12345678"})
    muster = r'^[a-zA-Z0-9]{40}$'
    if not re.match(muster, response.text()):
        return False 
    
    # Datenabfrage testen
    response = requests.get(BASE + "user/UserData/",data={"Token": response.text()})
    if not test_response(response.json()):	
        return False

    # Erfolgreichenes Auslagen
    response = requests.get(BASE + "user/logout/",data={"Token":response.text()})
    if not response.text():
        return False

    # Nutzer Anlegen
    response = requests.get(BASE + "user/register/",data={"username": "Herbert","password":"12345678","Email":"test@uni.de"})
    
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
    response = requests.get(BASE + "datastruct/list/")
    if response.status_code >= 500:
        return False
    
    # Heap
    response = requests.get(BASE + "datastruct/heap/")
    if response.status_code >= 500:
        return False
    
    return True

def test_database():
    pass