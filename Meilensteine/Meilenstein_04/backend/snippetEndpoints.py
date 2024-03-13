# alle
from typing import Any
from flask import Flask, request
from flask_restful import Api, Resource, abort

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
       
class snippet(Resource):   
    def get(self,snippetId):
        # Login überprüfen
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        # SQL-Abfrage und Ergebnis zurückgeben
        try:
            cursor.execute("""SELECT id, code, js FROM public."CodeSnippet" WHERE id = %s;""", (snippetId, ))
            result = cursor.fetchall()
            if len(result) == 0:
                return abort(404, message="Snippet not found")
        except:
            return abort(404, message="Snippet not found")
        
        return jsonify({"id":result[0][0],"code": result[0][1], "js": result[0][2]})

api.add_resource(snippet, "/snippet/<string:snippetId>")