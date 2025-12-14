# Pandapipes Component Parameters Reference

## Junction Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| pn_bar | float | No | 1.0 | Nominal pressure in bar | 0.1 - 100 |
| tfluid_k | float | No | 293.15 | Fluid temperature in Kelvin | 273.15 - 373.15 |
| height_m | float | No | 0.0 | Height above ground in meters | -100 - 100 |
| name | string | Yes | - | Junction identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## External Grid Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| p_bar | float | Yes | 50.0 | Grid pressure in bar | 0.1 - 100 |
| t_k | float | No | 293.15 | Temperature in Kelvin | 273.15 - 373.15 |
| name | string | Yes | - | Grid identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Source Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| mdot_kg_per_s | float | Yes | 1.0 | Mass flow rate in kg/s | 0.001 - 1000 |
| scaling | float | No | 1.0 | Scaling factor | 0.1 - 10 |
| name | string | Yes | - | Source identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Sink Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| mdot_kg_per_s | float | Yes | 1.0 | Mass demand in kg/s | 0.001 - 1000 |
| scaling | float | No | 1.0 | Scaling factor | 0.1 - 10 |
| name | string | Yes | - | Sink identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Pump Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| std_type | string | No | - | Standard pump type | - |
| pressure_list | list[float] | No | - | Pressure curve points | - |
| flowrate_list | list[float] | No | - | Flow rate curve points | - |
| reg_polynomial_degree | int | No | 1 | Polynomial degree | 1 - 5 |
| poly_coefficents | list[float] | No | - | Polynomial coefficients | - |
| name | string | Yes | - | Pump identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Pipe Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| std_type | string | No | - | Standard pipe type | - |
| length_km | float | No | 1.0 | Length in kilometers | 0.001 - 100 |
| diameter_m | float | Yes | 0.1 | Inner diameter in meters | 0.001 - 10 |
| k_mm | float | No | 0.01 | Roughness in millimeters | 0.0001 - 10 |
| loss_coefficient | float | No | 0.0 | Additional loss coefficient | 0.0 - 10 |
| sections | int | No | 1 | Number of pipe sections | 1 - 100 |
| alpha_w_per_m2k | float | No | 0.0 | Heat transfer coefficient | -100 - 100 |
| text_k | float | No | 293.15 | Ambient temperature in Kelvin | 273.15 - 373.15 |
| qext_w | float | No | 0.0 | External heat transfer | -1000 - 1000 |
| name | string | Yes | - | Pipe identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Valve Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| diameter_m | float | Yes | 0.05 | Valve diameter in meters | 0.001 - 10 |
| opened | bool | No | true | Whether valve is open | true/false |
| loss_coefficient | float | No | 0.0 | Additional loss coefficient | 0.0 - 10 |
| name | string | Yes | - | Valve identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Compressor Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| pressure_ratio | float | Yes | 1.5 | Pressure increase ratio | 0.1 - 10 |
| name | string | Yes | - | Compressor identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Heat Exchanger Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| diameter_m | float | Yes | 0.1 | Exchanger diameter in meters | 0.001 - 10 |
| qext_w | float | No | 0.0 | External heat transfer | -1000 - 1000 |
| loss_coefficient | float | No | 0.0 | Heat loss coefficient | 0.0 - 10 |
| name | string | Yes | - | Exchanger identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Mass Storage Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| mdot_kg_per_s | float | Yes | 1.0 | Mass flow rate in kg/s | 0.001 - 1000 |
| init_m_stored_kg | float | No | 0.0 | Initial stored mass | -100000 - 100000 |
| min_m_stored_kg | float | No | 0.0 | Minimum stored mass | -100000 - 100000 |
| max_m_stored_kg | float | No | 100000 | Maximum stored mass | -100000 - 100000 |
| scaling | float | No | 1.0 | Scaling factor | 0.1 - 10 |
| name | string | Yes | - | Storage identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Flow Control Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| controlled_mdot_kg_per_s | float | Yes | 1.0 | Controlled flow rate | 0.001 - 1000 |
| diameter_m | float | Yes | 0.1 | Control diameter in meters | 0.001 - 10 |
| control_active | bool | No | true | Control is active | true/false |
| name | string | Yes | - | Control identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Pressure Control Parameters

| Parameter | Type | Required | Default | Description | Range |
|-----------|------|----------|---------|-------------|-------|
| controlled_junction | int | Yes | - | Junction to control | 0 - 100000 |
| controlled_p_bar | float | Yes | 1.0 | Target pressure in bar | 0.1 - 100 |
| control_active | bool | No | true | Control is active | true/false |
| loss_coefficient | float | No | 0.0 | Additional loss coefficient | 0.0 - 10 |
| name | string | Yes | - | Control identifier | - |
| in_service | bool | No | true | Active in simulation | true/false |

## Common Parameters Across All Components

| Parameter | Applies To | Description |
|-----------|-------------|-------------|
| name | All components | Component identifier |
| in_service | All components | Whether component is active in simulation |
| index | All components | Internal index in pandapipes tables |
| geodata | Junctions, Pipes, Valves | Geographic coordinate data |
| kwargs | All components | Additional keyword arguments |