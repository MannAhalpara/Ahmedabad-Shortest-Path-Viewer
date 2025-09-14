import { FC } from 'react'

const Toolbar: FC = () => {
  return (
    <div className="bg-gray-800 text-white p-2 flex justify-between">
      <h1 className="text-lg">Ahmedabad Graph Viewer</h1>
      <div>
        <button className="px-2 py-1 bg-blue-500 rounded">Reset View</button>
      </div>
    </div>
  )
}

export default Toolbar