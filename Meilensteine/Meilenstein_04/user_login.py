# alle
from typing import Any
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
from flask import make_response
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
            response = make_response('Login erfolgreich')
            response.set_cookie('sessiontoken', token)  # Cookie setzen, um den Session-Token zu speichern
            return response
        

class user(Resource):
    def get(self):
        cursor = database.cursor()

        # Daten aus dem Request holen und überprüfen
        try:
            user_token = request.cookies.get('sessiontoken')
            cursor.execute("SELECT * FROM User WHERE session_token = %s", (user_token))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(401, message="API key is missing or invalid")
        except:
            return abort(401, message="API key is missing or invalid ")
        
        # SQL-Abfrage und Ergebnis zurückgeben
        cursor.execute("SELECT `username`, `rights`, `email` FROM User WHERE session_token = %s", (user_token))
        result = cursor.fetchall()

        response_dic = {"username": result[0][0], "admin": result[0][1], "email": result[0][2]}
        return (200,response_dic)
    
    def post(self):
        cursor = database.cursor()

        # Daten aus dem Request holen und überprüfen
        try:
            user_token = request.cookies.get('sessiontoken')
            cursor.execute("SELECT `rights` FROM User WHERE session_token = %s", (user_token))
            result = cursor.fetchall()
            if len(result) == 0 or result[0][0] != 1:
                return abort(401, message="API key is missing or invalid")
        except:
            return abort(401, message="API key is missing or invalid ")
        
        # Daten aus dem Request holen
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")
        admin = request.form.get("admin")

        # SQL-Abfrage
        cursor.execute("INSERT INTO User (username, password, email, rights) VALUES (%s, %s, %s, %s)", (username, sha256(password.encode('utf-8')).hexdigest(), email, admin))
        database.commit()
        return (200,"user successfully created")
    
    def put(self):
        cursor = database.cursor()

        # Daten aus dem Request holen und überprüfen
        try:
            user_token = request.cookies.get('sessiontoken')
            cursor.execute("SELECT `rights` FROM User WHERE session_token = %s", (user_token))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(404, message="User not found ")
            if result[0][0] != 1:
                return abort(403, message="User not allowed to execute this operation")
        except:
            return abort(401, message="API key is missing or invalid ")
        
        # Daten aus dem Request holen
        username = request.form.get("username")
        password = request.form.get("password")
        email = request.form.get("email")
        admin = request.form.get("admin")

        # SQL-Abfrage
        cursor.execute("UPDATE User SET password = %s, email = %s, rights = %s WHERE username = %s", (sha256(password.encode('utf-8')).hexdigest(), email, admin, username))
        database.commit()
        return (200,"user got updated")
    
class user_delete(Resource):
    def delete(self, edit_userid):
        cursor = database.cursor()

        # Daten aus dem Request holen und überprüfen
        try:
            user_token = request.cookies.get('sessiontoken')
            cursor.execute("SELECT `rights` FROM User WHERE session_token = %s", (user_token))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(401, message="API key is missing or invalid ")
            if result[0][0] != 1:
                return abort(403, message="User not allowed to execute this operation")
        except:
            return abort(401, message="API key is missing or invalid ")
        
        # Daten des zu löschenden Users überprüfen
        cursor.execute("SELECT * FROM User WHERE user_id = %s", (edit_userid,))
        if len(cursor.fetchall()) == 0:
            return abort(404, message="User not found ")

        # SQL-Abfrage
        cursor.execute("DELETE FROM User WHERE user_id = %s", (edit_userid,))
        database.commit()
        return (200,"user got deleted")
    
    def get(self, edit_userid):
        cursor = database.cursor()

        # Daten aus dem Request holen und überprüfen
        try:
            user_token = request.cookies.get('sessiontoken')
            cursor.execute("SELECT `rights` FROM User WHERE session_token = %s", (user_token))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(401, message="API key is missing or invalid ")
            if result[0][0] != 1:
                return abort(403, message="User not allowed to execute this operation")
        except:
            return abort(401, message="API key is missing or invalid ")
        
        # Daten des Users überprüfen
        cursor.execute("SELECT * FROM User WHERE user_id = %s", (edit_userid,))
        result = cursor.fetchall()
        if len(result) == 0:
            return abort(404, message="User not found ")

        # SQL-Abfrage
        cursor.execute("SELECT `user_is`, `username`, `rights`, `email` FROM User WHERE user_id = %s", (edit_userid,))
        result = cursor.fetchall()

        response_dic = {"id":result[0][0],"username": result[0][1], "admin": result[0][2], "email": result[0][3]}
        return (200,response_dic)
    
class useres(Resource):
    def get(self):
        cursor = database.cursor()

        # Daten aus dem Request holen und überprüfen
        try:
            user_token = request.cookies.get('sessiontoken')
            cursor.execute("SELECT `rights` FROM User WHERE session_token = %s", (user_token))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(401, message="API key is missing or invalid ")
            if result[0][0] != 1:
                return abort(403, message="User not allowed to execute this operation")
        except:
            return abort(401, message="API key is missing or invalid ")
        
        # SQL-Abfrage
        cursor.execute("SELECT `user_id`, `username`, `rights`, `email` FROM User")
        result = cursor.fetchall()

        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i][0],"username": result[i][1], "admin": result[i][2], "email": result[i][3]})
        return (200,response_dic)
     