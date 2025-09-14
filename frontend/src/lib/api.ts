export interface Node {
  id: string
  x: number
  y: number
  size: number
  degree: number
  lat?: number
  lon?: number
  ref?: string
}

export interface Edge {
  source: string
  target: string
  highway: string
  length: number
  color: string
}

export interface Chunk {
  nodes_file: string
  edges_file: string
  node_count: number
  edge_count: number
}

export interface Index {
  chunks: Chunk[]
}

export async function fetchIndex(): Promise<Index> {
  const response = await fetch('http://localhost:8000/api/graph/index', { headers: { 'Accept-Encoding': 'gzip' } })
  if (!response.ok) throw new Error('Failed to fetch index')
  return response.json()
}

export async function fetchNodes(chunkId: number): Promise<Node[]> {
  const response = await fetch(`http://localhost:8000/api/graph/nodes/${chunkId}`, { headers: { 'Accept-Encoding': 'gzip' } })
  if (!response.ok) throw new Error(`Failed to fetch nodes chunk ${chunkId}`)
  return response.json()
}

export async function fetchEdges(chunkId: number): Promise<Edge[]> {
  const response = await fetch(`http://localhost:8000/api/graph/edges/${chunkId}`, { headers: { 'Accept-Encoding': 'gzip' } })
  if (!response.ok) throw new Error(`Failed to fetch edges chunk ${chunkId}`)
  return response.json()
}

export async function searchNodes(query: string): Promise<Node[]> {
  const response = await fetch(`http://localhost:8000/api/graph/search/${encodeURIComponent(query)}`)
  if (!response.ok) throw new Error('Failed to search nodes')
  return response.json()
}