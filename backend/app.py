from flask import Flask, jsonify
from flask_cors import CORS
from osrs_api import GrandExchange
from osrs_api import Item
import requests

app = Flask(__name__)
CORS(app)  # This will allow all origins by default
base_url = 'https://services.runescape.com/m=itemdb_oldschool/api/graph/'
@app.route('/api/items/<string:name>', methods=['GET'])
def get_data(name):
    item_id = Item.get_ids(name)
    response = requests.get(base_url + str(item_id) + '.json')
    print(response)
    results = response.json()
    return jsonify({'message': results})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
