# alle
from typing import Any
from flask import Flask, request
from flask_restful import Api, Resource, abort
from flask_cors import CORS
from flask_httpauth import HTTPBasicAuth
import random
import string
import secrets

# wichtige 
from hashlib import sha256
import psycopg2
from flask import make_response, jsonify
from datetime import datetime
import Endpoints_util 

app = Flask(__name__)
api = Api(app)


auth = HTTPBasicAuth()

database = Endpoints_util.db_connect()
cursor = database.cursor()
DESIRED_FORMAT = "%Y-%m-%d %H:%M:%S+00:00"
MAX_APIKEY_AGE_MIN = 20

class userapitoken(Resource):
    @auth.verify_password
    def verify_password(username, password):
        # SQL-Abfrage
        cursor.execute("""SELECT passwd FROM public."User" WHERE name = %s;""",(username,))
        # Ergebnis der Abfrage
        result = cursor.fetchone()
        
        # Wenn kein Ergebnis zurückgegeben wird, ist der Login fehlgeschlagen
        if result == None:
            return abort(401, message="login not successfull")
        
        if result[0] != sha256(password.encode('utf-8')).hexdigest():
            return abort(401, message="login not successfull")
        return True

    @auth.login_required
    def post(self):
        
        # Daten aus dem Request holen
        username = request.authorization.username
                
        # Wenn ein Ergebnis zurückgegeben wird, ist der Login erfolgreich
        # 64 stelligen SessionToken generieren
        apikey = secrets.token_urlsafe(64)
        #apikey = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(64))
        # Zeitstempel generieren
        timestamp = datetime.now().strftime(DESIRED_FORMAT)

        # SQL-Abfrage
        cursor.execute("""UPDATE public."ApiKey" SET key = %s, created = %s WHERE "user" = (SELECT id FROM public."User" WHERE name = %s);""", (apikey, timestamp, username))
        database.commit()
        # Token zurückgeben
        response = make_response('login successfull')
        response.set_cookie('apiKey', apikey, secure=True, httponly=True)  # Cookie setzen, um den Session-Token zu speichern
        return response

    def get(self):
        apikey = request.cookies.get('apiKey')
        if apikey == None:
            return abort(401, message="apitoken not valid")
        return jsonify("apitoken valid")


    def delete(self):
        # Daten aus dem Request holen
        apikey = request.cookies.get('apiKey')
        if apikey == None:
            return abort(401, message="API key is missing or invalid")

        # SQL-Abfrage
        cursor.execute("""UPDATE public."ApiKey" SET created = %s WHERE key = %s;""", ('2000-01-01 00:00:00+00', apikey))
        database.commit()
        
        response = make_response("apitoken delted")
        response.set_cookie('apiKey', '', expires=0, secure=True, httponly=True)
        return response
      
class user(Resource):   
    def get(self):

        # Daten aus dem Request holen und überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)

        # SQL-Abfrage und Ergebnis zurückgeben
        cursor.execute("""SELECT id, name, rights, email FROM public."User" WHERE id =%s;""", (user_uuid,))
        result = cursor.fetchall()
        response_dic = {"id": result[0][0], "username": result[0][1], "admin": result[0][2], "email": result[0][3]}
        return (response_dic, 200)
    
    def post(self):
        # Daten aus dem Request holen
        try:
            id = request.form.get("id")
            name = request.form.get("username")
            passwd= request.form.get("passwd")
            email = request.form.get("email")
            admin = bool(request.form.get("admin"))
            if id is None or name is None or passwd is None or email is None or admin is None:
                return abort(409, message="Send data conflicts with existing entry")
        except:
            return abort(409, message="Send data conflicts with existing entry")
        
        # SQL-Abfrage
        try:
            cursor.execute("""INSERT INTO public."User" (id, name, passwd, email, rights) VALUES (%s,%s, %s, %s, %s)""", (id, name, sha256(passwd.encode('utf-8')).hexdigest(), email, admin))
            database.commit()
            apikey = secrets.token_urlsafe(64)
            #apikey = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(64))
            cursor.execute("""INSERT INTO public."ApiKey" ("user", key, created) VALUES (%s,%s,%s)""", (id, apikey, "2000-01-01 00:00:00+00"))
            database.commit()
        except psycopg2.Error:
            database.rollback()
            return abort(409, message="Send data conflicts with existing entry")

        return jsonify("user successfully created")
    
    def put(self):

        # Daten aus dem Request holen und überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        # Daten aus dem Request holen
        try:
            id = request.form.get("id")
            name = request.form.get("username")
            passwd= request.form.get("passwd")
            email = request.form.get("email")
            admin = request.form.get("admin")
            if id is None or name is None or passwd is None or email is None or admin is None:
                return abort(409, message="Send data conflicts with existing entry")
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        
        # SQL-Abfrage
        result = None
        try:
            cursor.execute("""SELECT id FROM public."User" WHERE id = %s""", (id,))
            result = cursor.fetchone()
            if len(result) == 0:
                return abort(404, message="User not found")
        except:
            return abort(404, message="User not found")
        
        #User Können sich selbst bearbeiten aber keine anderen User, außer Administartoren
        if result[0] != user_uuid:
            if not Endpoints_util.verify_admin(user_uuid, database):
                return abort(403, message="User not allowed to execute this operation")

        try:
            cursor.execute("""UPDATE public."User" SET name = %s, passwd = %s, email = %s, rights = %s WHERE id = %s """, (name, sha256(passwd.encode('utf-8')).hexdigest(), email, admin, id))
            database.commit()
        except psycopg2.Error:
            database.rollback()
            return abort(409, message="Send data conflicts with existing entry")
        
        return jsonify("User got updated")
    
class user_edit(Resource):
    def delete(self, edit_userid):

        # Daten aus dem Request holen und überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)

        # Auf Adminrechte überprüfen
        Endpoints_util.verify_admin(user_uuid, database)
        
        # Daten des zu löschenden Users überprüfen
        try:
            cursor.execute("""SELECT id FROM public."User" WHERE id = %s""", (edit_userid,))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(404, message="User not found")
            else:
                cursor.execute("""DELETE FROM public."User" WHERE id = %s""", (edit_userid,))
                database.commit()
        except psycopg2.Error:
            database.rollback()
            return abort(404, message="User not found")

        return jsonify("user got deleted")
    
    def get(self, edit_userid):

        # Daten aus dem Request holen und überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)
        # Auf Adminrechte überprüfen
        Endpoints_util.verify_admin(user_edit, database)
        
        # Daten des Users überprüfen
        try:
            cursor.execute("""SELECT id, name, email, rights FROM public."User" WHERE id = %s""", (edit_userid,))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(404, message="User not found")
        except psycopg2.Error:
            database.rollback()
            return abort(404, message="User not found")

        # SQL Anfrage Auswertung
        response_dic = {"id":result[0][0],"username": result[0][1], "admin": result[0][3], "email": result[0][2]}
        return jsonify(response_dic)
    
class useres(Resource):
    def get(self):

        # Daten aus dem Request holen und überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)
        # Auf Adminrechte überprüfen
        Endpoints_util.verify_admin(user_uuid, database)
        
        # SQL-Abfrage
        cursor.execute("""SELECT id, name, rights, email FROM public."User"; """)
        result = cursor.fetchall()
        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i-1][0],"username": result[i-1][1], "admin": result[i-1][2], "email": result[i-1][3]})
        return jsonify(response_dic)

api.add_resource(user, '/user')
api.add_resource(user_edit, '/user_edit/<edit_userid>')
api.add_resource(useres, '/useres')
api.add_resource(userapitoken,'/user/apitoken')