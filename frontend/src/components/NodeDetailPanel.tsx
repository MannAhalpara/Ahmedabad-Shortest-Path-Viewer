import { FC, useEffect, useState } from 'react';
import { graphData } from '../lib/graphStore';

const NodeDetailPanel: FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = graphData.subscribe((data) => {
      setSelectedNode(data.selectedNode ? data.selectedNode.id : null);
      setNodes(data.nodes);
    });
    return () => unsubscribe();
  }, []);

  if (!selectedNode || !nodes) return null;

  const node = nodes.find((n) => n.id === selectedNode);
  if (!node) return null;

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded shadow w-64">
      <h3 className="font-bold">Node Details</h3>
      <p><strong>ID:</strong> {node.id}</p>
      {node.lat && <p><strong>Latitude:</strong> {node.lat}</p>}
      {node.lon && <p><strong>Longitude:</strong> {node.lon}</p>}
      {node.ref && <p><strong>Ref:</strong> {node.ref}</p>}
      <p><strong>Degree:</strong> {node.degree}</p>
    </div>
  );
};

export default NodeDetailPanel;
