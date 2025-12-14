# Gas Network Simulation Web Application

A web application for gas network simulation using Python with FastAPI backend and React frontend with React Flow for interactive network editing.

## Features

- **Interactive Graph Editor**: Draw gas pipeline networks using mouse
- **Network Elements**: Add junctions, external grids, sources, sinks, and pumps/compressors
- **Simulation**: Run steady-state pipeflow calculations using pandapipes
- **Results Visualization**: View pressures at nodes and flows through pipes
- **Database**: Save and load network graphs to/from SQLite database

## Tech Stack

### Backend
- Python 3.x
- FastAPI
- pandapipes (e2nIEE/pandapipes)
- SQLAlchemy for SQLite ORM
- Pydantic for request/response schemas

### Frontend
- React with TypeScript
- React Flow for graph/canvas editing
- Vite for bundling

## Setup and Installation

### Quick Start (Recommended)

1. Run the build script:
```bash
./build.sh
```

2. Start the application:
```bash
source venv/bin/activate
python main.py
```

3. Open your browser to: `http://localhost:8000`

### Manual Setup

#### Backend Setup

1. Create and activate virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

2. Install Python dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Build the frontend:
```bash
npm run build
```

4. Go back to root directory:
```bash
cd ..
```

5. Run the FastAPI server:
```bash
python main.py
```

The application will be available at `http://localhost:8000` (serves both API and frontend)

### Development Mode

For development with hot reload:

1. Make sure virtual environment is activated:
```bash
source venv/bin/activate
```

2. Start backend:
```bash
./venv/bin/python main.py
```

2. In another terminal, start frontend dev server:
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000` and API at `http://localhost:8000`

## Known Issues

### Python 3.13 Compatibility
Currently, Python 3.13 is not compatible with the latest versions of pydantic and FastAPI due to internal changes in how `ForwardRef._evaluate()` is called. 

**Solutions:**
1. Use Python 3.11 or earlier (recommended)
2. Wait for updated packages that support Python 3.13
3. Use the provided virtual environment with compatible packages

The build script creates a virtual environment with compatible package versions that work with Python 3.13.

1. **Create Network Elements**:
   - Select a tool from the toolbar (Junction, External Grid, Source, Sink, Pump)
   - Click on the canvas to place the element
   - Use the Pipe tool to connect elements by dragging between nodes

2. **Edit Properties**:
   - Click on any node or edge to select it
   - Use the Properties panel to edit parameters
   - Changes are applied immediately

3. **Run Simulation**:
   - Click "Run Simulation" in the toolbar
   - Results will show pressures at nodes and flows through pipes
   - Nodes will be colored based on pressure status (green=OK, red=too low pressure)

4. **Save/Load Networks**:
   - Click "Save Network" to store the current network
   - Click "Load Network" to retrieve a saved network

## API Endpoints

### Simulation
- `POST /api/simulate` - Run simulation on a network
- `POST /api/simulate/{network_id}` - Run simulation on stored network

### Network Management
- `POST /api/networks` - Save a network
- `GET /api/networks` - List all saved networks
- `GET /api/networks/{id}` - Get a specific network
- `DELETE /api/networks/{id}` - Delete a network

## Network Data Format

### Node Types
- **junction**: Mass flow neutral nodes (○)
- **external_grid**: Slack/boundary condition (●)
- **source**: Gas supply (△)
- **sink**: Gas demand (□→)
- **pump**: Compressor/pressure boosting (○+)

### Example Network JSON

```json
{
  "name": "Sample Network",
  "nodes": [
    {
      "id": "n1",
      "type": "external_grid",
      "x": 100,
      "y": 200,
      "params": {
        "p_bar": 50.0,
        "t_k": 293.15
      }
    },
    {
      "id": "n2",
      "type": "sink",
      "x": 400,
      "y": 200,
      "params": {
        "demand_kg_per_s": 10.0,
        "p_min_bar": 20.0
      }
    }
  ],
  "edges": [
    {
      "id": "e1",
      "from": "n1",
      "to": "n2",
      "type": "pipe",
      "params": {
        "length_m": 10000,
        "diameter_m": 0.5,
        "roughness_m": 1e-5,
        "in_service": true
      }
    }
  ]
}
```

## File Structure

```
├── main.py                    # FastAPI entrypoint
├── models.py                  # SQLAlchemy models
├── schemas.py                 # Pydantic models
├── database.py                # DB session handling
├── pandapipes_adapter.py      # JSON ↔ pandapipes converter
├── requirements.txt           # Python dependencies
├── build.sh                  # Build script
├── setup_example.py          # Example network setup
├── static/                   # Built frontend files (created by npm run build)
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CanvasEditor.tsx
    │   │   ├── Toolbar.tsx
    │   │   ├── PropertiesPanel.tsx
    │   │   ├── NetworkList.tsx
    │   │   ├── JunctionNode.tsx
    │   │   ├── ExternalGridNode.tsx
    │   │   ├── SourceNode.tsx
    │   │   ├── SinkNode.tsx
    │   │   └── PumpNode.tsx
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── types.ts
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## Example HTTP Requests

### Save a Network
```bash
curl -X POST "http://localhost:8000/api/networks" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Network",
    "description": "Example network",
    "network": {
      "name": "Test Network",
      "nodes": [...],
      "edges": [...]
    }
  }'
```

### List Networks
```bash
curl -X GET "http://localhost:8000/api/networks"
```

### Run Simulation
```bash
curl -X POST "http://localhost:8000/api/simulate" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Network",
    "nodes": [...],
    "edges": [...]
  }'
```

## Dependencies

### Backend
- fastapi>=0.104.1
- uvicorn[standard]>=0.24.0
- pandapipes>=0.10.0
- sqlalchemy>=2.0.23
- pydantic>=2.5.0
- python-multipart>=0.0.6

### Frontend
- react>=18.2.0
- react-dom>=18.2.0
- reactflow>=11.10.4
- typescript>=5.2.2
- vite>=5.0.8

## License

This project is provided as-is for educational and demonstration purposes.