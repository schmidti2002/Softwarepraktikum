# alle
from flask import Flask, request
from flask_restful import Api, Resource, abort
from flask_cors import CORS
import random
import string
import datetime
import socket
import os
import configparser

# wichtige 
from hashlib import sha256
import mysql.connector

database = mysql.connector.connect(host=host_url,user=user_name,passwd=password,db=Datenbank,auth_plugin='mysql_native_password')

class login(Resource):
    def get(self):
        cursor = database.cursor()

        # Daten aus dem Request holen
        username = request.form.get("username")
        password = request.form.get("password")

        # SQL-Abfrage
        cursor.execute("SELECT * FROM User WHERE username = %s AND password = %s", (username, sha256(password.encode('utf-8')).hexdigest()))
        # Ergebnis der Abfrage
        result = cursor.fetchall()
        # Wenn kein Ergebnis zurückgegeben wird, ist der Login fehlgeschlagen
        if len(result) == 0:
            return abort(401, message="Login failed")
        
        # Wenn ein Ergebnis zurückgegeben wird, ist der Login erfolgreich
        else:
            # 40 stelligen Token generieren
            token = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(64))
            # SQL-Abfrage
            cursor.execute("UPDATE User SET session_token = %s WHERE username = %s", (token, username))
            # Token zurückgeben
            return ({"Token":token},200)
        