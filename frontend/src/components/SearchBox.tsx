import { FC, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchNodes } from '../lib/graphStore';
import { graphData } from '../lib/graphStore';

const SearchBox: FC = () => {
  const [query, setQuery] = useState('');
  const { data: results = [] } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchNodes(query),
    enabled: !!query,
  });

  const setSelectedNode = (node: any) => {
    graphData.update((current) => ({ ...current, selectedNode: node }));
   };

  return (
    <div className="absolute top-20 left-4 bg-white p-2 rounded shadow w-64">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-1 border rounded"
        placeholder="Search nodes..."
      />
      <ul>
        {results.map((node: any) => (
          <li
            key={node.id}
            className="cursor-pointer hover:bg-gray-200 p-1"
            onClick={() => setSelectedNode(node)}
          >
            {node.ref || node.id} {/* Use node.ref or node.id instead of node.name */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBox;
