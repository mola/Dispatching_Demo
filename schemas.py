from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class NodeParams(BaseModel):
    model_config = {"extra": "allow"}

class ExternalGrid(BaseModel):
    p_bar: float
    t_k: Optional[float] = 293.15

class Source(BaseModel):
    mdot_kg_per_s: float

class Sink(BaseModel):
    demand_kg_per_s: float
    p_min_bar: float

class Pump(BaseModel):
    pressure_ratio: Optional[float] = None
    p_out_bar: Optional[float] = None
    eta: Optional[float] = 0.8

class EdgeParams(BaseModel):
    model_config = {"extra": "allow"}
    
    # Pipe parameters
    length_m: Optional[float] = None
    length_km: Optional[float] = None
    diameter_m: float
    roughness_m: Optional[float] = None
    k_mm: Optional[float] = None
    in_service: Optional[bool] = True
    
    # Valve parameters
    opened: Optional[bool] = None

class Node(BaseModel):
    id: str
    type: str  # junction, external_grid, source, sink, pump
    x: float
    y: float
    params: Dict[str, Any]

class Edge(BaseModel):
    id: str
    from_node: str
    to_node: str
    type: str = "pipe"  # pipe, valve
    params: EdgeParams

class NetworkRequest(BaseModel):
    name: Optional[str] = "Unnamed Network"
    nodes: List[Node]
    edges: List[Edge]

class NetworkResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

class NetworkListResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime
    fluid: Optional[str] = None

class SimulationNodeResult(BaseModel):
    id: str
    pressure_bar: Optional[float] = None
    status: Optional[str] = None  # for sinks

class SimulationEdgeResult(BaseModel):
    id: str
    mdot_kg_per_s: Optional[float] = None
    velocity_m_per_s: Optional[float] = None

class SimulationResponse(BaseModel):
    nodes: List[SimulationNodeResult]
    edges: List[SimulationEdgeResult]
    success: bool
    message: Optional[str] = None

class SaveNetworkRequest(BaseModel):
    name: str
    description: Optional[str] = None
    network: NetworkRequest