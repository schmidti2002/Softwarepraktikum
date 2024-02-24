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
import Endpoints_util 

app = Flask(__name__)
api = Api(app)

database = Endpoints_util.db_connect()
cursor = database.cursor()
       
class code_state(Resource):   
    def post(self):

        # Login überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)

        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        # Daten aus dem Request holen und überprüfen
        try:
            id = request.form.get("id")
            state = request.form.get("state")
            snippet= request.form.get("snippet")
        except :
            return abort(409, message="Send data conflicts with existing entry")

        # SQL-Abfrage und Ergebnis zurückgeben
        try:
            cursor.execute("""INSERT INTO public."CodeState" (id, state, snippet) VALUES (%s, %s, %s)""", (id, state, snippet))
            result = cursor.fetchall()
            return jsonify("State created")
        except:
            return abort(409, message="State not created")
class code_state_id(Resource):        
    def get(self,stateId):
        # Login überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        # SQL-Abfrage und Ergebnis zurückgeben
        try:
            cursor.execute("""SELECT id, state, snippet FROM public."CodeState" WHERE id = %s;""", (stateId, ))
            result = cursor.fetchall()
            return jsonify({"id":result[0][0],"state": result[0][1], "snippet": result[0][2]})
        except:
            return abort(409, message="State not found")
        
    def delete(self,stateId):
        # Login überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        # Auf Adminrechte überprüfen
        Endpoints_util.verify_admin(user_uuid, database)
        
        # SQL-Abfrage und Ergebnis zurückgeben
        try:
            cursor.execute("""DELETE FROM public."CodeState" WHERE id = %s;""", (stateId, ))
            result = cursor.fetchall()
            return jsonify("State deleted")
        except:
            return abort(404, message="State not found")
        
api.add_resource(code_state, "/code-state")
api.add_resource(code_state_id, "/code-state/<string:stateId>")
