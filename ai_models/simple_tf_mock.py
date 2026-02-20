"""
Simple TensorFlow Mock Service - Minimal dependencies
Provides basic endpoints without full TensorFlow loading
"""

from flask import Flask, request, jsonify
import json

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model': 'TensorFlow Mock',
        'version': '1.0.0'
    })

@app.route('/predict', methods=['POST'])
def predict():
    return jsonify({
        'predictions': [
            {
                'className': 'Bengal Tiger',
                'probability': 0.95
            }
        ],
        'model': 'mock'
    })

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'status': 'ok', 'message': 'Mock TensorFlow service running'})

if __name__ == '__main__':
    print("🤖 Starting Mock TensorFlow Service on port 5004...")
    print("✅ Service ready at http://localhost:5004")
    app.run(host='0.0.0.0', port=5004, debug=False)
