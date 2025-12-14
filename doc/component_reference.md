# Pandapipes Component Reference

## Node Components

### 1. Junction (`junction`)
**Description**: Connection points in the gas network
**Parameters**:
- `pn_bar` (float): Nominal pressure in bar
- `tfluid_k` (float): Fluid temperature in Kelvin  
- `height_m` (float): Height above ground in meters
- `name` (str): Junction name
- `in_service` (bool): Whether junction is active
- `geodata` (dict): Geographic data

### 2. External Grid (`external_grid`)
**Description**: Source of gas supply with fixed pressure
**Parameters**:
- `p_bar` (float): Pressure in bar
- `t_k` (float): Temperature in Kelvin
- `name` (str): Grid name
- `in_service` (bool): Whether grid is active

### 3. Source (`source`)
**Description**: Gas source with fixed mass flow
**Parameters**:
- `mdot_kg_per_s` (float): Mass flow rate in kg/s
- `scaling` (float): Scaling factor
- `name` (str): Source name
- `in_service` (bool): Whether source is active

### 4. Sink (`sink`)
**Description**: Gas consumption point with demand
**Parameters**:
- `mdot_kg_per_s` (float): Mass flow demand in kg/s
- `scaling` (float): Scaling factor
- `name` (str): Sink name
- `in_service` (bool): Whether sink is active

### 5. Pump (`pump`)
**Description**: Pump that increases pressure
**Parameters**:
- `std_type` (str): Standard pump type
- `pressure_list` (list): Pressure curve points
- `flowrate_list` (list): Flow rate curve points
- `reg_polynomial_degree` (int): Polynomial degree for curve
- `poly_coefficents` (list): Polynomial coefficients
- `name` (str): Pump name
- `in_service` (bool): Whether pump is active

### 6. Circulation Pump (`circ_pump_mass_flow`, `circ_pump_const_pressure`)
**Description**: Circulation pumps for closed-loop systems
**Parameters**:
- `p_flow_bar` (float): Flow pressure
- `mdot_flow_kg_per_s` (float): Mass flow rate
- `t_flow_k` (float): Temperature
- `plift_bar` (float): Pressure lift (for const pressure)
- `type` (str): Pump type
- `name` (str): Pump name
- `in_service` (bool): Whether pump is active

### 7. Mass Storage (`mass_storage`)
**Description**: Gas storage facility
**Parameters**:
- `mdot_kg_per_s` (float): Mass flow rate
- `init_m_stored_kg` (float): Initial stored mass
- `min_m_stored_kg` (float): Minimum stored mass
- `max_m_stored_kg` (float): Maximum stored mass
- `scaling` (float): Scaling factor
- `name` (str): Storage name
- `in_service` (bool): Whether storage is active

## Edge Components

### 1. Pipe (`pipe`)
**Description**: Gas pipeline connection
**Parameters**:
- `std_type` (str): Standard pipe type
- `length_km` (float): Length in kilometers
- `diameter_m` (float): Inner diameter in meters
- `k_mm` (float): Roughness in millimeters
- `loss_coefficient` (float): Additional loss coefficient
- `sections` (int): Number of pipe sections
- `alpha_w_per_m2k` (float): Heat transfer coefficient
- `text_k` (float): Ambient temperature
- `qext_w` (float): External heat transfer
- `name` (str): Pipe name
- `in_service` (bool): Whether pipe is active
- `geodata` (dict): Geographic data

### 2. Valve (`valve`)
**Description**: Flow control valve
**Parameters**:
- `diameter_m` (float): Valve diameter in meters
- `opened` (bool): Whether valve is open
- `loss_coefficient` (float): Additional loss coefficient
- `name` (str): Valve name
- `in_service` (bool): Whether valve is active

### 3. Compressor (`compressor`)
**Description**: Gas compressor with pressure ratio
**Parameters**:
- `pressure_ratio` (float): Pressure increase ratio
- `name` (str): Compressor name
- `in_service` (bool): Whether compressor is active

### 4. Flow Control (`flow_control`)
**Description**: Mass flow control device
**Parameters**:
- `controlled_mdot_kg_per_s` (float): Controlled flow rate
- `diameter_m` (float): Control diameter
- `control_active` (bool): Whether control is active
- `name` (str): Control name
- `in_service` (bool): Whether control is active

### 5. Pressure Control (`pressure_control`)
**Description**: Pressure control device
**Parameters**:
- `controlled_junction` (int): Junction to control
- `controlled_p_bar` (float): Target pressure
- `control_active` (bool): Whether control is active
- `loss_coefficient` (float): Additional loss coefficient
- `name` (str): Control name
- `in_service` (bool): Whether control is active

### 6. Heat Exchanger (`heat_exchanger`)
**Description**: Heat exchange device
**Parameters**:
- `diameter_m` (float): Exchanger diameter
- `qext_w` (float): External heat transfer
- `loss_coefficient` (float): Heat loss coefficient
- `name` (str): Exchanger name
- `in_service` (bool): Whether exchanger is active

## Common Parameters

### `in_service` (bool)
- **Description**: Whether component is active in simulation
- **Applies to**: All components
- **Default**: `true`

### `name` (str)
- **Description**: Component identifier
- **Applies to**: All components
- **Required**: Yes

### `height_m` (float)
- **Description**: Elevation above reference level
- **Applies to**: Junctions
- **Default**: `0.0`

### `tfluid_k`, `t_k` (float)
- **Description**: Fluid temperature in Kelvin
- **Applies to**: Junctions, External Grids, Sources, Pumps
- **Default**: `293.15` (20°C)

### `pn_bar`, `p_bar` (float)
- **Description**: Nominal/absolute pressure in bar
- **Applies to**: Junctions (pn_bar), External Grids, Pumps (p_bar)
- **Units**: bar

### `diameter_m` (float)
- **Description**: Inner diameter in meters
- **Applies to**: Pipes, Valves, Heat Exchangers, Flow Controls
- **Units**: meters

### `length_km` (float)
- **Description**: Pipe length in kilometers
- **Applies to**: Pipes
- **Units**: kilometers

### `k_mm` (float)
- **Description**: Pipe roughness in millimeters
- **Applies to**: Pipes
- **Units**: millimeters
- **Default**: `0.01` (typical steel pipe)

### `mdot_kg_per_s` (float)
- **Description**: Mass flow rate in kg/s
- **Applies to**: Sources, Sinks, Mass Storage, Flow Controls
- **Units**: kg/s