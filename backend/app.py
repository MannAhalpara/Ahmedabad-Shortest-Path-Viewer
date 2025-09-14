from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

class Config:
    DATA_PROCESSED_DIR = "data/processed"
    BACKEND_PORT = 8000

@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Flask backend for graph viewer is running."})

@app.route("/api/graph/index", methods=["GET"])
def get_index():
    index_path = os.path.join(Config.DATA_PROCESSED_DIR, "index.json")
    if not os.path.exists(index_path):
        return jsonify({"error": "Index not found. Run preprocess.py first."}), 404
    with open(index_path, "r") as f:
        return jsonify(json.load(f))

@app.route("/api/graph/nodes/<int:chunk_id>", methods=["GET"])
def get_nodes(chunk_id):
    node_path = os.path.join(Config.DATA_PROCESSED_DIR, f"nodes_{chunk_id}.json")
    if not os.path.exists(node_path):
        return jsonify({"error": f"Nodes chunk {chunk_id} not found."}), 404
    with open(node_path, "r") as f:
        return jsonify(json.load(f))

@app.route("/api/graph/edges/<int:chunk_id>", methods=["GET"])
def get_edges(chunk_id):
    edge_path = os.path.join(Config.DATA_PROCESSED_DIR, f"edges_{chunk_id}.json")
    if not os.path.exists(edge_path):
        return jsonify({"error": f"Edges chunk {chunk_id} not found."}), 404
    with open(edge_path, "r") as f:
        return jsonify(json.load(f))

@app.route("/api/graph/search/<query>", methods=["GET"])
def search_nodes(query):
    results = []
    index_path = os.path.join(Config.DATA_PROCESSED_DIR, "index.json")
    if not os.path.exists(index_path):
        return jsonify({"error": "Index not found."}), 404
    with open(index_path, "r") as f:
        index = json.load(f)
    for chunk_id in range(len(index["chunks"])):
        node_path = os.path.join(Config.DATA_PROCESSED_DIR, f"nodes_{chunk_id}.json")
        if os.path.exists(node_path):
            with open(node_path, "r") as f:
                nodes = json.load(f)
                for node in nodes:
                    if query.lower() in str(node["id"]).lower() or query.lower() in str(node["ref"]).lower():
                        results.append(node)
    return jsonify(results[:10])  # Limit to 10 results

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=Config.BACKEND_PORT, debug=True)