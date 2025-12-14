# Gas Network Simulation API

This is a simple API documentation for the gas network simulation web application.

## Base URL
`http://localhost:8000`

## Endpoints

### 1. Run Simulation

**POST** `/api/simulate`

Run a steady-state simulation on a gas network.

**Request Body:**
```json
{
  "name": "Network Name",
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
    }
  ],
  "edges": [
    {
      "id": "e1",
      "from": "n1",
      "to": "n2",
      "type": "pipe",
      "params": {
        "length_m": 1000,
        "diameter_m": 0.1,
        "roughness_m": 1e-5,
        "in_service": true
      }
    }
  ]
}
```

**Response:**
```json
{
  "nodes": [
    {
      "id": "n1",
      "pressure_bar": 50.0,
      "status": "OK"
    }
  ],
  "edges": [
    {
      "id": "e1",
      "mdot_kg_per_s": 1.5,
      "velocity_m_per_s": 10.2
    }
  ],
  "success": true,
  "message": "Simulation completed successfully"
}
```

### 2. Save Network

**POST** `/api/networks`

Save a network to the database.

**Request Body:**
```json
{
  "name": "My Network",
  "description": "A test network",
  "network": {
    "name": "My Network",
    "nodes": [...],
    "edges": [...]
  }
}
```

**Response:**
```json
{
  "id": 1
}
```

### 3. List Networks

**GET** `/api/networks`

Get a list of all saved networks.

**Response:**
```json
[
  {
    "id": 1,
    "name": "My Network",
    "description": "A test network",
    "created_at": "2023-12-13T10:30:00Z"
  }
]
```

### 4. Get Network

**GET** `/api/networks/{network_id}`

Get a specific network by ID.

**Response:**
```json
{
  "id": 1,
  "name": "My Network",
  "description": "A test network",
  "network": {
    "name": "My Network",
    "nodes": [...],
    "edges": [...]
  },
  "created_at": "2023-12-13T10:30:00Z",
  "updated_at": "2023-12-13T11:00:00Z"
}
```

### 5. Delete Network

**DELETE** `/api/networks/{network_id}`

Delete a network by ID.

**Response:**
```json
{
  "message": "Network deleted successfully"
}
```

### 6. Simulate Stored Network

**POST** `/api/simulate/{network_id}`

Run simulation on a stored network without sending the full JSON.

**Response:** Same as `/api/simulate`

## Node Types

### Junction
- **Symbol**: ○ (circle outline)
- **Purpose**: Mass flow neutral nodes
- **Parameters**: None (typically)

### External Grid
- **Symbol**: ● (filled circle)
- **Purpose**: Slack/boundary condition
- **Parameters**:
  - `p_bar` (float): Pressure in bar
  - `t_k` (float, optional): Temperature in Kelvin

### Source
- **Symbol**: △ (triangle)
- **Purpose**: Gas supply/injection
- **Parameters**:
  - `mdot_kg_per_s` (float): Mass flow rate in kg/s

### Sink
- **Symbol**: □→ (rectangle with arrow)
- **Purpose**: Gas demand
- **Parameters**:
  - `demand_kg_per_s` (float): Demand in kg/s
  - `p_min_bar` (float): Minimum required pressure in bar

### Pump
- **Symbol**: ○+ (circle with plus)
- **Purpose**: Compressor/pressure boosting
- **Parameters**:
  - `pressure_ratio` (float, optional): Pressure ratio
  - `p_out_bar` (float, optional): Outlet pressure in bar
  - `eta` (float, optional): Efficiency (default: 0.8)

## Edge (Pipe) Parameters

All edges are pipes with the following parameters:

- `length_m` (float): Length in meters
- `diameter_m` (float): Diameter in meters
- `roughness_m` (float): Roughness in meters
- `in_service` (boolean): Whether the pipe is in service

## Error Responses

All endpoints may return error responses with status codes:

- **400 Bad Request**: Invalid input data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

Example error response:
```json
{
  "detail": "Simulation failed: Network has no valid paths"
}
```