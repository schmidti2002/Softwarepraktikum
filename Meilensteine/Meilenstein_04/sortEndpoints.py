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
CORS(app)
api = Api(app)

database = Endpoints_util.db_connect()
cursor = database.cursor()

class sort_algo(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        cursor.execute("""SELECT id, name, version, snippet, type FROM public."SortAlgo";""")
        result = cursor.fetchall()

        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i-1][0],"name": result[i-1][1], "version": result[i-1][2], "snippet": result[i-1][3], "type": result[i-1][3]})
        return jsonify(response_dic)

class sort_favorite(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        cursor = database.cursor()
        cursor.execute("""SELECT id, name, data, state FROM public."SortFavorite" JOIN public."Sort" ON public."Sort".id = public."SortFavorite".data WHERE public."Sort".owner = %s;""", (user_uuid,))
        result = cursor.fetchall()
        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i-1][0],"name": result[i-1][1], "data": result[i-1][2], "state": result[i-1][3]})
        return jsonify(response_dic)

    def post(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        try:
            id = request.form.get("id")
            name = request.form.get("name")
            data= request.form.get("data")
            state = request.form.get("state")
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        try:
            cursor.execute("""INSERT INTO public."SortFavorite" (id, name, data, state) VALUES (%s, %s, %s, %s)""", (id, name, data, state))
            database.commit()
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        return jsonify("new favorite created")
    
    def delete(self, favorite_id):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")

        cursor.execute("""SELECT data FROM public."SortFavorite" WHERE id = %s""", (favorite_id,))
        result = cursor.fetchone()
        if result == None:
            return abort(404, message="favorite not found")
        
        cursor.execute("""SELECT owner FROM public."Sort" WHERE id = %s""", (result[0],))
        result = cursor.fetchone()
        if result[0] != user_uuid:
            return abort(403, message="User not allowed to execute this operation")

        cursor.execute("""DELETE FROM public."SortFavorite" WHERE id = %s""", (favorite_id,))
        database.commit()

        return jsonify("favorite removed")
    
class sort_data(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        cursor.execute("""SELECT id, values FROM public."Sort" WHERE owner = %s;""", (user_uuid,))
        result = cursor.fetchall()
        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i-1][0],"name": result[i-1][1]})
        return jsonify(response_dic)
    
    def post(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        try:
            id = request.form.get("id")
            values = request.form.get("values")
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        try:
            cursor.execute("""INSERT INTO public."Sort" (id, values, owner) VALUES (%s, %s, %s)""", (id, values, user_uuid))
            database.commit()
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        return jsonify("data entry created")
    
class sort_data_id(Resource):   
    def get(self, sort_id):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        try:
            cursor.execute("""SELECT id, values, type FROM public."Sort" WHERE id = %s;""", (sort_id,))
        except :
            return abort(404, message="sort not found")
        result = cursor.fetchall()
        response_dic = {"id":result[0],"values": result[1], "type": result[2]}
        return (response_dic,200)