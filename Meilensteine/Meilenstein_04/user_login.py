# alle
from typing import Any
from flask import Flask, request
from flask_restful import Api, Resource, abort
from flask_cors import CORS
import random
import string

# wichtige 
from hashlib import sha256
import psycopg2
from flask import make_response, jsonify
from datetime import datetime

app = Flask(__name__)
CORS(app)
api = Api(app)

host_url = "swp.dczlabs.xyz"
port = "3131"
user_name = "swpusr"
password = "251f6100a8ff1dd2"
Datenbank = "swp"

database = psycopg2.connect(host=host_url,port=port, user=user_name,password=password,database=Datenbank)
cursor = database.cursor()
DESIRED_FORMAT = "%Y-%m-%d %H:%M:%S+00:00"
MAX_APIKEY_AGE_MIN = 20

def verifyapikey(request):
    # Daten aus dem Request holen und überprüfen
    try:
        apikey = request.cookies.get('apiKey')
        timestamp = datetime.now().strftime(DESIRED_FORMAT)

        cursor.execute("""SELECT "user", created FROM public."ApiKey" WHERE key = %s;""",(apikey,))
        result = cursor.fetchone()
        time_diff = datetime.strptime(timestamp, DESIRED_FORMAT) - datetime.strptime(str(result[1]), DESIRED_FORMAT)
        if result[0] == apikey and time_diff.total_seconds() <= MAX_APIKEY_AGE_MIN * 60:
            return abort(401, message="API key is missing or invalid")
        return apikey # API-Key zurückgeben
    except :
        return abort(401, message="API key is missing or invalid ")

def verifyapikey_admin(apikey):
    cursor.execute("""SELECT rights FROM public."User" JOIN public."ApiKey" on public."ApiKey"."user" = public."User"."id" WHERE key = %s;""", (apikey,))
    result = cursor.fetchone()
    if not result[0]:
        return abort(403, message="User not allowed to execute this operation")
    return True # Adminrechte zurückgeben

class login(Resource):
    def get(self):

        # Daten aus dem Request holen
        username = request.form.get("username")
        password = request.form.get("password")
        # SQL-Abfrage
        cursor.execute("""SELECT passwd FROM public."User" WHERE name = %s;""",(username,))
        # Ergebnis der Abfrage
        result = cursor.fetchone()
        
        # Wenn kein Ergebnis zurückgegeben wird, ist der Login fehlgeschlagen
        if result == None:
            return abort(401, message="login not successfull")
        
        if result[0] != sha256(password.encode('utf-8')).hexdigest():
            return abort(401, message="login not successfull")
        
        # Wenn ein Ergebnis zurückgegeben wird, ist der Login erfolgreich
        else:
            # 64 stelligen SessionToken generieren
            apikey = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(64))
            # Zeitstempel generieren
            timestamp = datetime.now().strftime(DESIRED_FORMAT)

            # SQL-Abfrage
            cursor.execute("""UPDATE public."ApiKey" SET key = %s, created = %s WHERE "user" = (SELECT id FROM public."User" WHERE name = %s);""", (apikey, timestamp, username))
            database.commit()
            # Token zurückgeben
            response = make_response('login successfull')
            response.set_cookie('apiKey', apikey)  # Cookie setzen, um den Session-Token zu speichern
            return response
        
class user(Resource):   
    def get(self):

        # Daten aus dem Request holen und überprüfen
        apikey = verifyapikey(request)

        # SQL-Abfrage und Ergebnis zurückgeben
        cursor.execute("""SELECT id, name, rights, email FROM public."User" JOIN public."ApiKey" ON public."ApiKey".user = public."User".id WHERE public."ApiKey".key =%s;""", (apikey,))
        result = cursor.fetchall()
        response_dic = {"id": result[0][0], "username": result[0][1], "admin": result[0][2], "email": result[0][3]}
        return (response_dic, 200)
    
    def post(self):
        # Daten aus dem Request holen und überprüfen
        apikey = verifyapikey(request)

        # Auf Adminrechte überprüfen
        verifyapikey_admin(apikey)
        
        # Daten aus dem Request holen
        try:
            id = request.form.get("id")
            name = request.form.get("username")
            passwd= request.form.get("passwd")
            email = request.form.get("email")
            admin = bool(request.form.get("admin"))
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        # SQL-Abfrage
        try:
            cursor.execute("""INSERT INTO public."User" (id, name, passwd, email, rights) VALUES (%s,%s, %s, %s, %s)""", (id, name, sha256(passwd.encode('utf-8')).hexdigest(), email, admin))
            database.commit()
            apikey = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(64))
            cursor.execute("""INSERT INTO public."ApiKey" ("user", key, created) VALUES (%s,%s,%s)""", (id, apikey, "2000-01-01 00:00:00+00"))
            database.commit()
        except :
            return abort(409, message="Send data conflicts with existing entry")

        return jsonify("user successfully created")
    
    def put(self):

        # Daten aus dem Request holen und überprüfen
        apikey = verifyapikey(request)

        # Auf Adminrechte überprüfen
        verifyapikey_admin(apikey)
        
        # Daten aus dem Request holen
        try:
            id = request.form.get("id")
            name = request.form.get("username")
            passwd= request.form.get("passwd")
            email = request.form.get("email")
            admin = request.form.get("admin")
        except :
            return abort(409, message="Send data conflicts with existing entry")

        # SQL-Abfrage
        try:
            cursor.execute("""UPDATE public."User" SET name = %s, passwd = %s, email = %s, rights = %s WHERE id = %s """, (name, sha256(passwd.encode('utf-8')).hexdigest(), email, admin, id))
            database.commit()
        except psycopg2.errors:
            return abort(404, message="User not found")
        
        return jsonify("User got updated")
    
class user_edit(Resource):
    def delete(self, edit_userid):

        # Daten aus dem Request holen und überprüfen
        apikey = verifyapikey(request)

        # Auf Adminrechte überprüfen
        verifyapikey_admin(apikey)
        
        # Daten des zu löschenden Users überprüfen
        try:
            cursor.execute("""DELETE FROM public."User" WHERE id = %s""", (edit_userid,))
            database.commit()
        except psycopg2.errors:
            return abort(404, message="User not found")

        return jsonify("user got deleted")
    
    def get(self, edit_userid):

        # Daten aus dem Request holen und überprüfen
        apikey = verifyapikey(request)
        # Auf Adminrechte überprüfen
        verifyapikey_admin(apikey)
        
        # Daten des Users überprüfen
        try:
            cursor.execute("""SELECT id, name, email, rights FROM public."User" WHERE id = %s""", (edit_userid,))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(404, message="User not found")
        except psycopg2.errors:
            return abort(404, message="User not found")

        # SQL Anfrage Auswertung
        response_dic = {"id":result[0][0],"username": result[0][1], "admin": result[0][3], "email": result[0][2]}
        return jsonify(response_dic)
    
class useres(Resource):
    def get(self):

        # Daten aus dem Request holen und überprüfen
        apikey = verifyapikey(request)
        # Auf Adminrechte überprüfen
        verifyapikey_admin(apikey)
        
        # SQL-Abfrage
        cursor.execute("""SELECT id, name, rights, email FROM public."User"; """)
        result = cursor.fetchall()
        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i-1][0],"username": result[i-1][1], "admin": result[i-1][2], "email": result[i-1][3]})
        return jsonify(response_dic)
     

api.add_resource(login, '/login')
api.add_resource(user, '/user') 
api.add_resource(user_edit, '/user/edit/<string:edit_userid>')
api.add_resource(useres, '/useres')
