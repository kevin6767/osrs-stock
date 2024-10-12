from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will allow all origins by default

@app.route('/api/data')
def get_data():
    return jsonify({'message': 'Data fetched successfully'})

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000)
