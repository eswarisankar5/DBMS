from flask import Flask, jsonify, request
from flask_cors import CORS
import threading
import uuid
from grocery_cart import start_scanning, stop_scanning, generate_bill

app = Flask(__name__)
CORS(app, supports_credentials=True)  # CORS support for cross-origin frontend

scan_thread = None
stored_bills = {}

@app.route('/api/start-scanning', methods=['POST'])
def start_scanning_route():
    global scan_thread
    print("🚀 /api/start-scanning endpoint hit")
    if scan_thread and scan_thread.is_alive():
        return jsonify({"message": "Scan already running"}), 400

    scan_thread = threading.Thread(target=start_scanning)
    scan_thread.start()
    return jsonify({"message": "Scanning started"}), 200

@app.route('/api/stop-scanning', methods=['POST'])
def stop_scanning_route():
    print("🛑 /api/stop-scanning endpoint hit")
    stop_scanning()
    return jsonify({"message": "Scanning stopped"}), 200

@app.route('/api/generate-bill', methods=['GET'])
def generate_bill_route():
    print("🧾 /api/generate-bill endpoint hit")
    bill, total = generate_bill(send_sms=False)
    unique_code = str(uuid.uuid4())[:8].upper()
    stored_bills[unique_code] = {
        "bill": bill,
        "total": total,
        "uniqueCode": unique_code
    }
    return jsonify({
        "bill": bill,
        "total": total,
        "uniqueCode": unique_code
    }), 200

@app.route('/api/get-bill/<code>', methods=['GET'])
def get_bill_by_code(code):
    code = code.upper()
    if code in stored_bills:
        return jsonify(stored_bills[code]), 200
    else:
        return jsonify({"error": "Bill not found"}), 404

if __name__ == '__main__':
    print("✅ Flask server running at http://127.0.0.1:5000")
    app.run(debug=True)