from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import json
import os

from database import get_db
from models import Network
from schemas import (
    NetworkRequest, NetworkResponse, NetworkListResponse, 
    SimulationResponse, SaveNetworkRequest
)
from pandapipes_adapter import create_network_from_json, run_simulation

app = FastAPI(title="Gas Network Simulation API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for frontend
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assets", StaticFiles(directory=os.path.join("static", "assets")), name="assets")

@app.get("/")
async def read_index():
    """Serve the main React app."""
    index_path = os.path.join("static", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Gas Network Simulation API - Frontend not built yet. Run 'cd frontend && npm run build'"}

@app.post("/api/simulate", response_model=SimulationResponse)
async def simulate_network(network: NetworkRequest, fluid: str = "lgas"):
    """Run simulation on a gas network."""
    try:
        # Convert to dict for pandapipes adapter
        network_dict = network.model_dump()
        
        # Create pandapipes network
        net = create_network_from_json(network_dict, fluid=fluid)
        
        # Run simulation
        results = run_simulation(net, network_dict)
        
        return SimulationResponse(**results)
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation failed: {str(e)}"
        )

@app.post("/api/networks", response_model=dict)
async def save_network(network_data: SaveNetworkRequest, db: Session = Depends(get_db)):
    """Save a network to the database."""
    try:
        # Convert network to JSON string
        network_json = json.dumps(network_data.network.model_dump())
        
        # Create new network record
        db_network = Network(
            name=network_data.name,
            description=network_data.description,
            data=network_json
        )
        
        db.add(db_network)
        db.commit()
        db.refresh(db_network)
        
        return {"id": db_network.id}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save network: {str(e)}"
        )

@app.get("/api/networks", response_model=List[NetworkListResponse])
async def list_networks(db: Session = Depends(get_db)):
    """Get list of all saved networks."""
    try:
        networks = db.query(Network).all()
        # Parse JSON data to extract fluid if present
        networks_with_fluid = []
        for network in networks:
            try:
                network_data = json.loads(network.data)
                fluid = network_data.get("fluid")
            except:
                fluid = None
            networks_with_fluid.append((network, fluid))
        
        return [
            NetworkListResponse(
                id=network.id,
                name=network.name,
                description=network.description,
                created_at=network.created_at,
                fluid=fluid
            )
            for network, fluid in networks_with_fluid
        ]
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve networks: {str(e)}"
        )

@app.get("/api/networks/{network_id}")
async def get_network(network_id: int, db: Session = Depends(get_db)):
    """Get a specific network by ID."""
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        if not network:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Network not found"
            )
        
        # Parse JSON data
        network_data = json.loads(network.data)
        
        return {
            "id": network.id,
            "name": network.name,
            "description": network.description,
            "network": network_data,
            "created_at": network.created_at,
            "updated_at": network.updated_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve network: {str(e)}"
        )

@app.delete("/api/networks/{network_id}")
async def delete_network(network_id: int, db: Session = Depends(get_db)):
    """Delete a network by ID."""
    try:
        network = db.query(Network).filter(Network.id == network_id).first()
        if not network:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Network not found"
            )
        
        db.delete(network)
        db.commit()
        
        return {"message": "Network deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete network: {str(e)}"
        )

@app.post("/api/simulate/{network_id}", response_model=SimulationResponse)
async def simulate_stored_network(network_id: int, fluid: str = "lgas", db: Session = Depends(get_db)):
    """Run simulation on a stored network."""
    try:
        # Get network from database
        network = db.query(Network).filter(Network.id == network_id).first()
        if not network:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Network not found"
            )
        
        # Parse JSON data
        network_dict = json.loads(network.data)
        
        # Create pandapipes network
        net = create_network_from_json(network_dict, fluid=fluid)
        
        # Run simulation
        results = run_simulation(net, network_dict)
        
        return SimulationResponse(**results)
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Simulation failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)