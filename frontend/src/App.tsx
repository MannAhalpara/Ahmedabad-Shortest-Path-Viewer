import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GraphCanvas from './components/GraphCanvas';
import LoadingOverlay from './components/LoadingOverlay';
import Toolbar from './components/Toolbar';
import SearchBox from './components/SearchBox';
import Legend from './components/Legend';
import NodeDetailPanel from './components/NodeDetailPanel';
import { loadGraphData, graphData } from './lib/graphStore';
import { MapBackground } from './components/MapBackground';
import 'leaflet/dist/leaflet.css';

const queryClient = new QueryClient();

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalNodesLoaded, setTotalNodesLoaded] = useState(0);
  const [totalNodes, setTotalNodes] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await loadGraphData();
        graphData.subscribe((data) => {
          setTotalNodesLoaded(data.nodes.length);
          setTotalNodes(data.nodes.length); // Update based on your index.json
          setLoading(false);
        })();
      } catch (err) {
        setError('Failed to load graph data');
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="h-screen w-screen flex flex-col">
        <Toolbar />
        <div className="flex-1 relative">
          <MapBackground>
            <GraphCanvas />
          </MapBackground>
          <LoadingOverlay
            loading={loading}
            error={error}
            nodesLoaded={totalNodesLoaded}
            totalNodes={totalNodes}
          />
          <SearchBox />
          <Legend />
          <NodeDetailPanel />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;