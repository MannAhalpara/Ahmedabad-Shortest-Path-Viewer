import { FC } from 'react'

const Legend: FC = () => {
  const highwayTypes = [
    { type: 'residential', color: '#ff69b4', label: 'Residential' },
    { type: 'primary', color: '#1e90ff', label: 'Primary' },
    { type: 'tertiary', color: '#32cd32', label: 'Tertiary' },
    { type: 'unclassified', color: '#808080', label: 'Unclassified' },
    { type: 'secondary', color: '#ffa500', label: 'Secondary' },
    { type: 'motorway', color: '#ff0000', label: 'Motorway' },
  ]

  return (
    <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow">
      <h3 className="font-bold">Legend</h3>
      <h4>Edges (Highway Type)</h4>
      {highwayTypes.map(({ type, color, label }) => (
        <div key={type} className="flex items-center">
          <div className="w-4 h-4 mr-2" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </div>
      ))}
      <h4>Nodes (Degree)</h4>
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2 bg-green-500" />
        <span>Low Degree</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 mr-2 bg-red-500" />
        <span>High Degree</span>
      </div>
    </div>
  )
}

export default Legend