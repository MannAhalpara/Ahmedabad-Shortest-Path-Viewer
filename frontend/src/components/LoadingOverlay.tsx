import { FC } from 'react'

interface LoadingOverlayProps {
  loading: boolean
  error: string | null
  nodesLoaded: number
  totalNodes: number
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({ loading, error, nodesLoaded, totalNodes }) => {
  if (!loading && !error) return null

  return (
    <div className="absolute top-4 left-4 bg-white p-4 rounded shadow">
      {loading && (
        <>
          <p>Loading graph...</p>
          <p>Nodes loaded: {nodesLoaded} / {totalNodes}</p>
          <div className="w-64 h-2 bg-gray-200 rounded">
            <div
              className="h-full bg-blue-500 rounded"
              style={{ width: `${(nodesLoaded / totalNodes) * 100}%` }}
            />
          </div>
        </>
      )}
      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  )
}

export default LoadingOverlay