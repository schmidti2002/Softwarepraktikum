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

class history(Resource):
    def get(self, type):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        try:
            offset = request.args.get("offset")
            limit = request.args.get("limit")
        except :
            offset = 0
            limit = 10


        if type == "sort":
            cursor.execute("""SELECT id, time, data, algo, name FROM public."SortHistory" JOIN public."SortAlgo" ON public."SortHistory".algo = public."SortAlgo".id WHERE user = %s;""", (user_uuid,))
        elif type == "list":
            cursor.execute("""SELECT id, time, data, algo, name FROM public."ListHistory" JOIN public."ListAlgo" ON public."ListHistory".algo = public."ListAlgo".id WHERE user = %s;""", (user_uuid,))
        elif type == "graph":
            cursor.execute("""SELECT id, time, data, algo, name FROM public."GraphHistory" JOIN public."GraphAlgo" ON public."GraphHistory".algo = public."GraphAlgo".id WHERE user = %s;""", (user_uuid,))
        elif type == "all":
            cursor.execute("""
                           SELECT id, time, data, algo, name FROM public."SortHistory" JOIN public."SortAlgo" ON public."SortHistory".algo = public."SortAlgo".id WHERE user = %s
                           UNION SELECT id, time, data, algo, name FROM public."ListHistory" JOIN public."ListAlgo" ON public."ListHistory".algo = public."ListAlgo".id WHERE user = %s
                           UNION SELECT id, time, data, algo, name FROM public."GraphHistory" JOIN public."GraphAlgo" ON public."GraphHistory".algo = public."GraphAlgo".id WHERE user = %s;
                           """, (user_uuid, user_uuid, user_uuid))
        else:
            return abort(404, message="Type not found")
        result = cursor.fetchall()

        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i-1][0],"time": result[i-1][1], "data": result[i-1][2], "algo": result[i-1][3], "algoName": result[i-1][4]})
        return jsonify(response_dic)

    def post(self, type):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        try:
            id = request.form.get("id")
            time = request.form.get("name")
            data = request.form.get("data")
            algo = request.form.get("algo")
        except :
            return abort(409, message="Send data conflicts with existing entry")
        try:
            if type == "sort":
                cursor.execute("""INSERT INTO public."SortHistory" (id, time, data, algo, user) VALUES (%s, %s, %s, %s, %s);""", (id, time, data, algo, user_uuid))
            elif type == "list":
                cursor.execute("""INSERT INTO public."ListHistory" (id, time, data, algo, user) VALUES (%s, %s, %s, %s, %s);""", (id, time, data, algo, user_uuid))
            elif type == "graph":
                cursor.execute("""INSERT INTO public."GraphHistory" (id, time, data, algo, user) VALUES (%s, %s, %s, %s, %s);""", (id, time, data, algo, user_uuid))
            else:
                return abort(404, message="Type not found")
            database.commit()
        except :
            return abort(409, message="Send data conflicts with existing entry")
        return make_response("history entry created", 200)

