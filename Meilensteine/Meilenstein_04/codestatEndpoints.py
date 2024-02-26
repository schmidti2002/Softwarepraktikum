# alle
from typing import Any
from flask import Flask, request
from flask_restful import Api, Resource, abort
from flask_cors import CORS
import json
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
            data_resquest= json.loads(request.get_json())
            id = data_resquest["id"]
            state = json.dumps(data_resquest["state"])
            snippet= data_resquest["snippet"]
            if id == None or state == None or snippet == None:
                return abort(409, message="Send data conflicts with existing entry")
        except :
            return abort(409, message="Send data conflicts with existing entry")
        # SQL-Abfrage und Ergebnis zurückgeben
        try:
            cursor.execute("""INSERT INTO public."CodeState" (id, state, snippet) VALUES (%s, %s, %s)""", (id, state, snippet))
            database.commit()
        except:
            database.rollback()
            return abort(409, message="Send data conflicts with existing entry")
        
        return jsonify("State created")
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
            if len(result) == 0:
                return abort(404, message="State not found")
        except:
            return abort(404, message="State not found")
        return jsonify({"id":result[0][0],"state": result[0][1], "snippet": result[0][2]})
        
    def delete(self,stateId):
        # Login überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        # Auf Rechte überprüfen
        try:
            cursor.execute("""SELECT owner FROM public."Graph" 
                              join public."GraphFavorite" ON public."GraphFavorite".data = public."Graph".id
                              where state = %s group by owner
                              union
                              SELECT owner FROM public."Graph" 
                              join public."ListFavorite" ON public."ListFavorite".data = public."List".id
                              where state = %s group by owner
                              union
                              SELECT owner FROM public."Graph" 
                              join public."SortFavorite" ON public."SortFavorite".data = public."Sort".id
                              where state = %s group by owner""", (stateId, stateId, stateId ))
            result = cursor.fetchall()

            if len(result) == 0:
                return ("State not found", 404)
            for i in range(len(result)):
                print(result[i][0])
                if result[i][0] == user_uuid:
                    break
                if i == len(result)-1:
                    return ("You are not allowed to delete this state", 403)
        except:
            return ("You are not allowed to delete this state", 403)
        
        # SQL-Abfrage und Ergebnis zurückgeben
        try:
            cursor.execute("""DELETE FROM public."CodeState" WHERE id = %s;""", (stateId, ))
            database.commit()
            return jsonify("State deleted")
        except:
            database.rollback()
            return abort(404, message="State not found")
        
api.add_resource(code_state, "/code-state")
api.add_resource(code_state_id, "/code-state/<string:stateId>")
