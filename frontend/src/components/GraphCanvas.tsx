import { useEffect, useRef, useState } from 'react';
import Sigma from 'sigma';
import { MultiDirectedGraph } from 'graphology';
import { graphData, loadGraphData } from '../lib/graphStore';

export default function GraphCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const g = new MultiDirectedGraph();
    sigmaRef.current = new Sigma(g, containerRef.current, {
      defaultEdgeColor: '#808080',
      labelSize: 12,
      edgeLabelSize: 10,
      minCameraRatio: 0.05,
      maxCameraRatio: 10,
      enableEdgeClickEvents: false,
      labelRenderedSizeThreshold: 9999,
    });

    loadGraphData().catch((err) => console.error('Failed to load graph:', err));

    const unsubscribe = graphData.subscribe((data) => {
      const g = sigmaRef.current?.getGraph();
      if (g) {
        g.clear();
        const maxDegree = Math.max(...data.nodes.map(n => n.degree || 0), 1);
        data.nodes.forEach((node) => {
          const degree = node.degree || 0;
          const hue = Math.min((degree / maxDegree) * 120, 120);
          const color = `hsl(${hue}, 70%, 50%)`;
          console.log(`Node ${node.id}: degree=${degree}, color=${color}`); // Debug initial color
          g.addNode(node.id, {
            x: node.x,
            y: node.y,
            size: 1, // Uniform size for all nodes
            color: color,
            label: node.ref || node.id,
          });
        });
        data.edges.forEach((edge) => {
          g.addDirectedEdge(edge.source, edge.target, {
            color: edge.color,
            size: edge.length / 1000,
          });
        });
        sigmaRef.current?.refresh();
        g.forEachNode((node, attributes) => {
          console.log(`Rendered Node ${node}: color=${attributes.color}, size=${attributes.size}`); // Debug rendered attributes
        });
      }
    });

    sigmaRef.current.on('clickNode', ({ node }) => {
      setSelectedNode(node);
    });

    return () => {
      unsubscribe();
      sigmaRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (selectedNode && sigmaRef.current) {
      const pos = sigmaRef.current.getGraph().getNodeAttributes(selectedNode);
      if (pos) {
        sigmaRef.current.getCamera().animate(
          { x: pos.x, y: pos.y, ratio: 0.5 },
          { duration: 500 }
        );
      }
    }
  }, [selectedNode]);

  return <div ref={containerRef} className="absolute inset-0" />;
}
