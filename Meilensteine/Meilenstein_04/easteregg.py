# alle
from flask_restful import Resource
from flask import jsonify

class brew_coffee(Resource):
    def get(self):
        return jsonify("Coffee is brewing", 418)


