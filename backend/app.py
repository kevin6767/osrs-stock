from flask import Flask, jsonify
from flask_cors import CORS
from osrs_api import GrandExchange
from osrs_api import Item
import requests

app = Flask(__name__)
CORS(app)  # This will allow all origins by default
base_url = 'https://services.runescape.com/m=itemdb_oldschool/api/graph/'
detail_url = 'https://services.runescape.com/m=itemdb_oldschool/api/catalogue/detail.json?'
hourly_url = 'https://prices.runescape.wiki/api/v1/osrs/timeseries'

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

@app.route('/api/items/hourly/<string:name>', methods=['GET'])
def get_(name):
    session = requests.Session()
    session.headers.update({'User-Agent': 'angular-charts - @203283045518671872 on Discord'})
    print(session.headers)
    item_id = Item.get_ids(name)
    hourlyResponse = session.get(hourly_url + '?timestep=24h&id=' + str(item_id))
    
    # Check if the request was successful   
    if hourlyResponse.status_code != 200:
        return jsonify({'error': 'Failed to fetch data', 'status_code': hourlyResponse.status_code}), 500

    try:
        # Attempt to get JSON data from the response
        results = hourlyResponse.json()

    except requests.exceptions.JSONDecodeError:
        return jsonify({'error': 'Received non-JSON response', 'response_text': hourlyResponse.text}), 500

    # Create a combined response
    return jsonify({'message': results, 'id': item_id})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
