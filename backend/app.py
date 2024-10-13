from flask import Flask, jsonify
from flask_cors import CORS
from osrs_api import GrandExchange
from osrs_api import Item
import requests

app = Flask(__name__)
CORS(app)  # This will allow all origins by default
base_url = 'https://services.runescape.com/m=itemdb_oldschool/api/graph/'
detail_url = 'https://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?'

@app.route('/api/items/<string:name>', methods=['GET'])
def get_data(name):
    item_id = Item.get_ids(name)
    response = requests.get(base_url + str(item_id) + '.json')
    detailResponse = requests.get(detail_url + 'item=' + str(item_id))

    # Get JSON data from responses
    results = response.json()
    detailResult = detailResponse.json()

    # Create a combined response
    combined_result = {
        'prices': results,    # Add the prices data
        'details': detailResult  # Add the details data
    }

    return jsonify({'message': combined_result})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
