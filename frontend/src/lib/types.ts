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