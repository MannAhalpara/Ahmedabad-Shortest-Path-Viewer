Graph Viewer for Ahmedabad Road Network
This is a graph viewer for the ahmedabad.graphml dataset (16384 nodes, 24k edges), built with React + Sigma.js (frontend) and Flask + NetworkX (backend). It supports progressive loading of 4 chunks (3x5000 + 1x1384 nodes), edge coloring by highway 
System: type, node coloring by degree, and search by id and ref. The app is designed for local development on Windows, with no Docker or deployment.
Prerequisites

Python 3.11+: For backend.
Node.js 18+ and pnpm: For frontend (install pnpm via npm install -g pnpm).
Git: For cloning the repository (optional).

Setup Instructions (Windows)

Clone the Repository (if applicable):
git clone <repository-url>
cd graph-viewer


Set Up Backend:

Navigate to the backend directory:cd backend


Create and activate a virtual environment:python -m venv venv
venv\Scripts\activate


Install dependencies:pip install -r requirements.txt


Copy .env.example to .env and update if needed (default port is 8000):copy .env.example .env




Set Up Frontend:

Navigate to the frontend directory:cd frontend


Install dependencies:pnpm install




Preprocess GraphML:

Ensure ahmedabad.graphml is in backend/data/raw/.
Run the preprocessing script to split into 4 chunks (~3x5000 + 1x1384 nodes) with ForceAtlas2 layout:python backend/preprocess.py --input backend/data/raw/ahmedabad.graphml --out backend/data/processed --chunk-size 5000 --layout forceatlas2




Run the App:

Use the provided scripts in the scripts/ directory:
Start both backend and frontend in development mode:scripts\dev.bat


Alternatively, run manually:
Backend: python backend/app.py
Frontend (in a new terminal): cd frontend && pnpm dev




Open http://localhost:5173 in your browser.


Build for Production (optional):

Build the frontend and ensure backend dependencies are installed:scripts\build.bat


Run the built app:scripts\run.bat





Features

Graph Rendering: Sigma.js with WebGL for pan/zoom, rendering 16384 nodes and ~24k edges.
Progressive Loading: Loads 4 chunks (~3x5000 + 1x1384 nodes) with a progress bar.
Coloring: Edges colored by highway type (e.g., residential=pink, primary=blue), nodes by degree (low=green, high=red).
Search: Search nodes by id or ref, centers and highlights matches.
Node Details: Side panel shows node attributes (id, lat, lon, ref, degree) on click.
Legend: Displays color mappings for highway types and node degrees.
Error Handling: Retries chunk fetches (3 attempts) and shows error messages.

Directory Structure
graph-viewer/
  README.md
  .env.example
  backend/
    app.py              # Flask API
    preprocess.py       # GraphML preprocessing script
    requirements.txt    # Python dependencies
    config.py           # Backend configuration
    data/
      raw/ahmedabad.graphml  # Input GraphML (private)
      processed/          # Processed chunks (index.json, nodes_*.json, edges_*.json)
  frontend/
    index.html          # HTML entry
    vite.config.ts      # Vite configuration
    package.json        # Frontend dependencies
    tsconfig.json       # TypeScript configuration
    postcss.config.cjs  # PostCSS configuration
    tailwind.config.cjs # TailwindCSS configuration
    src/
      main.tsx          # React entry
      App.tsx           # Main app component
      components/       # React components
      lib/              # API, state, worker, types
      styles.css        # TailwindCSS styles
  scripts/
    dev.bat           # Start dev servers
    build.bat         # Build frontend and install backend deps
    run.bat           # Run built app

Notes

The GraphML file (ahmedabad.graphml) must be placed in backend/data/raw/ before preprocessing.
Chunks are stored in backend/data/processed/ and served via the API (/api/graph).
The backend runs on http://localhost:8000 by default; the frontend runs on http://localhost:5173.
If you encounter issues, check the console for errors and ensure ports are free.

Troubleshooting

Backend Errors: Ensure ahmedabad.graphml is in backend/data/raw/ and run preprocess.py first.
Frontend Errors: Run pnpm install in frontend/ if dependencies fail.
Port Conflicts: Update .env with a different BACKEND_PORT if 8000 is in use.

For issues, contact the developer or check logs in backend/app.py and browser console.