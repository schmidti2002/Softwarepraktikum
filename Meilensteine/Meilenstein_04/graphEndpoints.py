# alle
from typing import Any
from flask import Flask, request
from flask_restful import Api, Resource, abort
from flask_cors import CORS

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

class graph_algo(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        cursor.execute("""SELECT id, name, version, snippet FROM public."GraphAlgo";""")
        result = cursor.fetchall()

        response_dic = []
        for i in range(len(result)):
            response_dic.append({"id":result[i-1][0],"name": result[i-1][1], "version": result[i-1][2], "snippet": result[i-1][3]})
        return jsonify(response_dic)

class graph_favorite(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        cursor = database.cursor()
        cursor.execute("""SELECT public."GraphFavorite".id, name, data, state FROM public."GraphFavorite" JOIN public."Graph" ON public."Graph".id = public."GraphFavorite".data WHERE public."Graph".owner = %s;""", (user_uuid,))
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
            cursor.execute("""INSERT INTO public."GraphFavorite" (id, name, data, state) VALUES (%s, %s, %s, %s)""", (id, name, data, state))
            database.commit()
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        return jsonify("new favorite created")
    
class graph_favorite_favorite_id(Resource):
    def delete(self, favorite_id):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")

        cursor.execute("""SELECT data FROM public."GraphFavorite" WHERE id = %s""", (favorite_id,))
        result = cursor.fetchone()
        if result == None:
            return abort(404, message="favorite not found")
        
        cursor.execute("""SELECT owner FROM public."Graph" WHERE id = %s""", (result[0],))
        result = cursor.fetchone()
        if result[0] != user_uuid:
            return abort(403, message="User not allowed to execute this operation")

        cursor.execute("""DELETE FROM public."GraphFavorite" WHERE id = %s""", (favorite_id,))
        database.commit()

        return jsonify("favorite removed")
    
class graph_data(Resource):
    def get(self):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        cursor.execute("""SELECT id, values FROM public."Graph" WHERE owner = %s;""", (user_uuid,))
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
            graph_id = request.form.get("id")
            nodes = request.form.get("nodes")
            edges = request.form.get("edges")
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        try:
            for node in nodes:
                cursor.execute("""INSERT INTO public."GraphNode" (id, graph, value) VALUES (%s, %s, %s)""", (node['id'], graph_id, node['value']))
                database.commit()
            for edge in edges:
                cursor.execute("""INSERT INTO public."GraphEdge" (from, to) VALUES (%s, %s)""", (edge['from'], edge['to']))
                database.commit()
        except :
            return abort(409, message="Send data conflicts with existing entry")
        
        return jsonify("data entry created")
    
class graph_data_id(Resource):   
    def get(self, graph_id):
        user_uuid = Endpoints_util.getUserUUID(request, database)
        
        if user_uuid == None:
            return abort(401, message="API key is missing or invalid")
        
        try:
            cursor.execute("""SELECT id FROM public."Graph" WHERE id = %s;""", (graph_id,))
        except :
            return abort(404, message="graph not found")
        result = cursor.fetchall()

        node_array=[]
        cursor.execute("""SELECT id, value FROM public."GraphNode" WHERE graph = %s;""", (graph_id,))
        result = cursor.fetchall()
        for i in range(len(result)):
            node_array.append({"id":result[i-1][0],"value": result[i-1][1]})
        
        edge_array=[]
        for  i in range(len(node_array)):
            cursor.execute("""SELECT from, to FROM public."GraphEdge" WHERE from = %s;""", (node_array[i-1]['id'],))
            result = cursor.fetchall()
            for i in range(len(result)):
                edge_array.append({"from":result[i-1][0],"to": result[i-1][1]})
        
        response_dic = {"id":graph_id, "nodes": node_array, "edges": edge_array}
        return (response_dic,200)
    
api.add_resource(graph_algo, '/graph/algo')
api.add_resource(graph_favorite, '/graph/favorite/')
api.add_resource(graph_favorite_favorite_id, '/graph/favorite/<favorite_id>')
api.add_resource(graph_data, '/graph/data')
api.add_resource(graph_data_id, '/graph/data/<graph_id>')
