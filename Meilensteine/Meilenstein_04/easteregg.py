# alle
from flask_restful import Resource, Api
from flask import Flask, jsonify

app = Flask(__name__)
api = Api(app)


class brew_coffee(Resource):
    def get(self):
        return jsonify("Coffee is brewing", 418)

app.add_resource(brew_coffee, '/brew_coffee')
