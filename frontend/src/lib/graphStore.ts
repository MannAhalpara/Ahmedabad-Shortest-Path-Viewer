import { writable } from 'svelte/store';

export interface Node {
  // Define the properties of a node, for example:
  id: string;
  [key: string]: any;
}

export interface Edge {
  // Define the properties of an edge, for example:
  source: string;
  target: string;
  [key: string]: any;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;
}

export const graphData = writable<GraphData>({ nodes: [], edges: [], selectedNode: null });

export async function loadGraphData() {
  try {
    const response = await fetch('http://localhost:8000/api/graph/index');
    if (!response.ok) throw new Error('Failed to fetch index');
    const index = await response.json();
    const nodes = [];
    const edges = [];
    for (const chunk of index.chunks) {
      const nodesResponse = await fetch(`http://localhost:8000/api/graph/nodes/${chunk.nodes_file.split('_')[1].split('.')[0]}`);
      const edgesResponse = await fetch(`http://localhost:8000/api/graph/edges/${chunk.edges_file.split('_')[1].split('.')[0]}`);
      if (!nodesResponse.ok || !edgesResponse.ok) throw new Error('Failed to fetch chunk');
      nodes.push(...await nodesResponse.json());
      edges.push(...await edgesResponse.json());
    }
    graphData.set({ nodes, edges, selectedNode: null });
  } catch (error) {
    console.error('Error loading graph data:', error);
    throw error;
  }
}

export async function searchNodes(query: string) {
  const response = await fetch(`http://localhost:8000/api/graph/search/${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Failed to search nodes');
  return await response.json();
}