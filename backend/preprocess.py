import argparse
import os
import json
import networkx as nx
from networkx.readwrite import graphml
import numpy as np
from config import Config

try:
    import cugraph
    CUGRAPH_AVAILABLE = True
except ImportError:
    CUGRAPH_AVAILABLE = False
    print("Warning: cuGraph not available. Using NetworkX spring_layout as fallback.")

def compute_layout(G):
    for node in G.nodes:
        # Get the raw coordinates
        lat = float(G.nodes[node].get('y', 0))  # OSM stores lat in 'y'
        lon = float(G.nodes[node].get('x', 0))  # OSM stores lon in 'x'
        
        if lat == 0 and lon == 0:
            # Skip nodes without coordinates
            continue
            
        # For Leaflet, we just need to pass through the coordinates
        # lat becomes y and lon becomes x
        G.nodes[node]["x"] = float(lon)  # Longitude goes to x
        G.nodes[node]["y"] = float(lat)  # Latitude goes to y
        # Store original coordinates
        G.nodes[node]["lat"] = float(lat)
        G.nodes[node]["lon"] = float(lon)
    
    return G

def compute_node_degree(G):
    degrees = dict(G.degree())
    max_degree = max(degrees.values(), default=1)
    for node in G.nodes:
        G.nodes[node]["degree"] = degrees[node]
        G.nodes[node]["size"] = 1 + 5 * (degrees[node] / max_degree)  # Scale size by degree
    return G

def assign_edge_colors(G):
    highway_colors = {
        "residential": "#ff69b4",  # Pink
        "primary": "#1e90ff",      # Blue
        "tertiary": "#32cd32",     # Green
        "unclassified": "#808080", # Gray
        "secondary": "#ffa500",    # Orange
        "motorway": "#ff0000",     # Red
    }
    edge_attrs = {}
    for u, v, key, data in G.edges(data=True, keys=True):
        highway = data.get("highway", "unclassified")
        edge_attrs[(u, v, key)] = {"color": highway_colors.get(highway, "#808080")}
    nx.set_edge_attributes(G, edge_attrs)
    return G

def save_chunks(G, output_dir, chunk_size):
    os.makedirs(output_dir, exist_ok=True)
    nodes = list(G.nodes(data=True))
    edges = list(G.edges(data=True, keys=True))
    num_nodes = len(nodes)
    num_chunks = (num_nodes + chunk_size - 1) // chunk_size

    index = {"chunks": []}
    for i in range(num_chunks):
        start = i * chunk_size
        end = min(start + chunk_size, num_nodes)
        chunk_nodes = nodes[start:end]
        node_ids = {n[0] for n in chunk_nodes}
        chunk_edges = [(u, v, d) for u, v, k, d in edges if u in node_ids or v in node_ids]

        node_data = [
            {
                "id": str(n[0]),
                "x": n[1]["x"],
                "y": n[1]["y"],
                "size": n[1]["size"],
                "degree": n[1]["degree"],
                "lat": n[1].get("lat"),
                "lon": n[1].get("lon"),
                "ref": n[1].get("ref", "")
            }
            for n in chunk_nodes
        ]
        edge_data = [
            {
                "source": str(u),
                "target": str(v),
                "highway": d.get("highway", "unclassified"),
                "length": d.get("length", 1.0),
                "color": d.get("color", "#808080")
            }
            for u, v, d in chunk_edges
        ]

        with open(os.path.join(output_dir, f"nodes_{i}.json"), "w") as f:
            json.dump(node_data, f)
        with open(os.path.join(output_dir, f"edges_{i}.json"), "w") as f:
            json.dump(edge_data, f)
        index["chunks"].append({
            "nodes_file": f"nodes_{i}.json",
            "edges_file": f"edges_{i}.json",
            "node_count": len(chunk_nodes),
            "edge_count": len(chunk_edges)
        })

    with open(os.path.join(output_dir, "index.json"), "w") as f:
        json.dump(index, f)
    return num_chunks

def main():
    parser = argparse.ArgumentParser(description="Preprocess GraphML for chunked loading.")
    parser.add_argument("--input", required=True, help="Path to input GraphML file")
    parser.add_argument("--out", required=True, help="Output directory for processed chunks")
    parser.add_argument("--chunk-size", type=int, default=Config.CHUNK_SIZE, help="Nodes per chunk")
    parser.add_argument("--layout", default="forceatlas2", choices=["forceatlas2", "spring"], help="Layout algorithm")
    args = parser.parse_args()

    G = graphml.read_graphml(args.input, node_type=str)
    print(f"Graph type: {type(G).__name__}")
    print(f"Number of nodes: {len(G.nodes)}")
    print(f"Number of edges: {len(G.edges)}")
    print(f"Sample edges (first 5): {list(G.edges(data=True, keys=True))[:5]}")
    
    G = compute_node_degree(G)
    G = assign_edge_colors(G)
    G = compute_layout(G)
    num_chunks = save_chunks(G, args.out, args.chunk_size)
    print(f"Processed {len(G.nodes)} nodes and {len(G.edges)} edges into {num_chunks} chunks.")

if __name__ == "__main__":
    main()