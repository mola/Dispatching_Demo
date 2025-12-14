import pandapipes as pp
import pandapower as ppower
from typing import Dict, Any, List
import json

def create_network_from_json(data: Dict[str, Any], fluid: str = "lgas") -> pp.pandapipesNet:
    """Convert JSON network representation to pandapipes network."""
    
    # Create empty network
    net = pp.create_empty_network(fluid=fluid, add_stdtypes=True)
    
    # Store mapping from node IDs to pandapipes junction indices
    node_to_junction = {}
    
    # First pass: create junctions for all nodes
    for node_data in data.get("nodes", []):
        node_id = node_data["id"]
        node_type = node_data["type"]
        params = node_data.get("params", {})
        
        # Create a junction for each node
        junction_idx = pp.create_junction(
            net, 
            pn_bar=params.get("pn_bar", params.get("p_bar", 1.0)),  # Default pressure
            tfluid_k=params.get("tfluid_k", params.get("t_k", 293.15)),  # Default temperature
        )
        node_to_junction[node_id] = junction_idx
        
        # Add specific elements based on node type
        if node_type == "external_grid":
            pp.create_ext_grid(
                net,
                junction=junction_idx,
                p_bar=params.get("p_bar", 50.0),
                t_k=params.get("t_k", 293.15),
            )
        
        elif node_type == "source":
            pp.create_source(
                net,
                junction=junction_idx,
                mdot_kg_per_s=params.get("mdot_kg_per_s", 1.0),
            )
        
        elif node_type == "sink":
            pp.create_sink(
                net,
                junction=junction_idx,
                mdot_kg_per_s=params.get("mdot_kg_per_s", params.get("demand_kg_per_s", 1.0)),
            )
        
        elif node_type == "pump":
            pp.create_pump(
                net,
                from_junction=junction_idx,
                to_junction=junction_idx,  # Simple pump connects same junction
                std_type=params.get("std_type", "P1"),
                pressure_list=params.get("pressure_list", [params.get("p_bar", 1.0)]),
                flowrate_list=params.get("flowrate_list", [params.get("mdot_kg_per_s", 1.0)]),
            )
        
        elif node_type == "circ_pump_mass_flow":
            # Circulation pumps not available in this version of pandapipes
            # Create as regular pump with flow parameter
            pp.create_pump(
                net,
                from_junction=junction_idx,
                to_junction=junction_idx,
                std_type="P1",
                pressure_list=[params.get("p_bar", 1.0)],
                flowrate_list=[params.get("mdot_kg_per_s", 1.0)],
            )
        
        elif node_type == "circ_pump_const_pressure":
            # Circulation pumps not available in this version of pandapipes
            # Create as regular pump with pressure parameter
            pp.create_pump(
                net,
                from_junction=junction_idx,
                to_junction=junction_idx,
                std_type="P1",
                pressure_list=[params.get("p_bar", 1.0)],
                flowrate_list=[params.get("mdot_kg_per_s", 1.0)],
            )
        
        elif node_type == "compressor":
            pp.create_compressor(
                net,
                from_junction=junction_idx,
                to_junction=junction_idx,
                pressure_ratio=params.get("pressure_ratio", 1.5),
            )
        
        elif node_type == "mass_storage":
            pp.create_mass_storage(
                net,
                junction=junction_idx,
                mdot_kg_per_s=params.get("mdot_kg_per_s", 1.0),
                init_m_stored_kg=params.get("init_m_stored_kg", 0.0),
                min_m_stored_kg=params.get("min_m_stored_kg", 0.0),
                max_m_stored_kg=params.get("max_m_stored_kg", 100000.0),
            )
        
        elif node_type == "heat_exchanger":
            pp.create_heat_exchanger(
                net,
                from_junction=junction_idx,
                to_junction=junction_idx,
                diameter_m=params.get("diameter_m", 0.1),
                qext_w=params.get("qext_w", 0.0),
            )
    
    # Second pass: create pipes and valves (edges)
    for edge_data in data.get("edges", []):
        edge_id = edge_data["id"]
        from_node = edge_data["from_node"]
        to_node = edge_data["to_node"]
        edge_type = edge_data["type"]
        params = edge_data.get("params", {})
        
        if from_node in node_to_junction and to_node in node_to_junction:
            if edge_type == "pipe":
                # Handle length parameter - prefer length_km if available, otherwise convert length_m
                length_km = params.get("length_km")
                if length_km is None or (isinstance(length_km, float) and str(length_km).lower() == 'nan'):
                    length_m = params.get("length_m", 1000)
                    length_km = length_m / 1000  # Convert to km
                elif length_km is None:
                    length_m = params.get("length_m", 1000)
                    length_km = length_m / 1000  # Convert to km
                
                # Handle roughness parameter - prefer roughness_m if available, otherwise use k_mm
                k_mm = params.get("k_mm")
                if k_mm is None or (isinstance(k_mm, float) and str(k_mm).lower() == 'nan'):
                    roughness_m = params.get("roughness_m")
                    if roughness_m is not None and str(roughness_m).lower() != 'nan':
                        k_mm = roughness_m * 1000  # Convert to mm
                    else:
                        k_mm = 0.01  # Default roughness in mm
                elif k_mm is None:
                    roughness_m = params.get("roughness_m")
                    if roughness_m is not None and str(roughness_m).lower() != 'nan':
                        k_mm = roughness_m * 1000  # Convert to mm
                    else:
                        k_mm = 0.01  # Default roughness in mm
                
                # Validate diameter_m parameter
                diameter_m = params.get("diameter_m", 0.1)
                if diameter_m is None or (isinstance(diameter_m, float) and str(diameter_m).lower() == 'nan'):
                    diameter_m = 0.1  # Default diameter
                
                # Validate in_service parameter
                in_service = params.get("in_service", True)
                if in_service is None or (isinstance(in_service, float) and str(in_service).lower() == 'nan'):
                    in_service = True  # Default to True if NaN
                
                pp.create_pipe_from_parameters(
                    net,
                    from_junction=node_to_junction[from_node],
                    to_junction=node_to_junction[to_node],
                    length_km=length_km,
                    diameter_m=diameter_m,
                    k_mm=k_mm,
                    in_service=in_service,
                )

            elif edge_type == "valve":
                opened_param = params.get("opened", True)
                if opened_param is None or (isinstance(opened_param, float) and str(opened_param).lower() == 'nan'):
                    opened_param = True

                diameter_m = params.get("diameter_m", 0.05)
                if diameter_m is None or (isinstance(diameter_m, float) and str(diameter_m).lower() == 'nan'):
                    diameter_m = 0.05

                loss_coefficient = params.get("loss_coefficient", 0.0)
                if loss_coefficient is None or (isinstance(loss_coefficient, float) and str(loss_coefficient).lower() == 'nan'):
                    loss_coefficient = 0.0

                pp.create_valve(
                    net,
                    from_junction=node_to_junction[from_node],
                    to_junction=node_to_junction[to_node],
                    diameter_m=diameter_m,
                    opened=opened_param,
                    loss_coefficient=loss_coefficient,
                )
            elif edge_type == "flow_control":
                # Ensure controlled_mdot parameter is a valid number, never NaN
                controlled_mdot = params.get("controlled_mdot_kg_per_s", 1.0)
                if controlled_mdot is None or (isinstance(controlled_mdot, float) and str(controlled_mdot).lower() == 'nan'):
                    controlled_mdot = 1.0  # Default to 1.0 if NaN
                
                # Ensure control_active parameter is a valid boolean
                control_active = params.get("control_active", True)
                if control_active is None:
                    control_active = True  # Default to True if None
                
                pp.create_flow_control(
                    net,
                    from_junction=node_to_junction[from_node],
                    to_junction=node_to_junction[to_node],
                    controlled_mdot_kg_per_s=controlled_mdot,
                    diameter_m=params.get("diameter_m", 0.1),
                    control_active=control_active,
                )
            
            elif edge_type == "pressure_control":
                # Ensure controlled_p_bar parameter is a valid number
                controlled_p_bar = params.get("controlled_p_bar", 1.0)
                if controlled_p_bar is None or (isinstance(controlled_p_bar, float) and str(controlled_p_bar).lower() == 'nan'):
                    controlled_p_bar = 1.0  # Default to 1.0 if NaN
                
                # Ensure control_active parameter is a valid boolean
                control_active = params.get("control_active", True)
                if control_active is None:
                    control_active = True  # Default to True if None
                
                # Create pressure control that enforces pressure at a specific junction
                # Note: This needs two junctions - one for control location, one for controlled location
                controlled_junction = node_to_junction.get(params.get("controlled_junction", to_node), node_to_junction[from_node])
                
                if controlled_junction is None:
                    # If no controlled junction specified, use the target junction
                    controlled_junction = node_to_junction[to_node]
                
                pp.create_pressure_control(
                    net,
                    controlled_junction=controlled_junction,
                    controlled_p_bar=controlled_p_bar,
                    control_active=control_active,
                )
            
            elif edge_type == "compressor":
                # Ensure pressure_ratio parameter is a valid number
                pressure_ratio = params.get("pressure_ratio", 1.5)
                if pressure_ratio is None or (isinstance(pressure_ratio, float) and str(pressure_ratio).lower() == 'nan'):
                    pressure_ratio = 1.5  # Default to 1.5 if NaN
                
                pp.create_compressor(
                    net,
                    from_junction=node_to_junction[from_node],
                    to_junction=node_to_junction[to_node],
                    pressure_ratio=pressure_ratio,
                )
            
            elif edge_type == "heat_exchanger":
                # Ensure diameter_m parameter is a valid number
                diameter_m = params.get("diameter_m", 0.1)
                if diameter_m is None or (isinstance(diameter_m, float) and str(diameter_m).lower() == 'nan'):
                    diameter_m = 0.1  # Default to 0.1 if NaN
                
                # Ensure qext_w parameter is a valid number
                qext_w = params.get("qext_w", 0.0)
                if qext_w is None or (isinstance(qext_w, float) and str(qext_w).lower() == 'nan'):
                    qext_w = 0.0  # Default to 0.0 if NaN
                
                pp.create_heat_exchanger(
                    net,
                    from_junction=node_to_junction[from_node],
                    to_junction=node_to_junction[to_node],
                    diameter_m=diameter_m,
                    qext_w=qext_w,
                )
    
    return net


def run_simulation(net: pp.pandapipesNet, original_data: Dict[str, Any]) -> Dict[str, Any]:
    """Run pandapipes simulation and extract results."""
    
    try:
        # Run the pipe flow calculation
        pp.pipeflow(net)
        
        # Extract node results
        node_results = []
        node_junction_map = {}
        
        # Create mapping from original nodes to junction indices
        junction_count = 0
        for node_data in original_data.get("nodes", []):
            node_id = node_data["id"]
            node_type = node_data["type"]
            node_junction_map[node_id] = junction_count
            junction_count += 1
        
        # Process results for each node
        for i, node_data in enumerate(original_data.get("nodes", [])):
            node_id = node_data["id"]
            node_type = node_data["type"]
            params = node_data.get("params", {})
            
            result = {"id": node_id}
            
            # Get pressure from junction results
            if i < len(net.res_junction):
                if hasattr(net.res_junction, 'p_bar'):
                    pressure_val = float(net.res_junction.p_bar.values[i])
                else:
                    pressure_val = float(net.res_junction.iloc[i]["p_bar"])
                
                # Convert NaN to None for JSON compatibility
                import math
                if math.isnan(pressure_val):
                    result["pressure_bar"] = None
                else:
                    result["pressure_bar"] = pressure_val
            
            # Special handling for sinks - check minimum pressure
            if node_type == "sink":
                min_pressure = params.get("p_min_bar", 0)
                actual_pressure = result.get("pressure_bar")
                if actual_pressure is not None and actual_pressure >= min_pressure:
                    result["status"] = "OK"
                else:
                    result["status"] = "pressure too low"
            
            node_results.append(result)
        
        edge_results = []
        import math

        def to_json_float(value: object):
            try:
                f = float(value)
            except Exception:
                return None
            return None if math.isnan(f) else f

        for i, edge_data in enumerate(original_data.get("edges", [])):
            edge_id = edge_data["id"]
            edge_type = edge_data["type"]
            result = {"id": edge_id}

            if edge_type == "pipe":
                pipe_idx = len([e for e in original_data.get("edges", [])[:i] if e["type"] == "pipe"])
                res_pipe = getattr(net, "res_pipe", None)
                if res_pipe is not None and pipe_idx < len(res_pipe):
                    result["mdot_kg_per_s"] = to_json_float(res_pipe.iloc[pipe_idx].get("mdot_from_kg_per_s"))
                    result["velocity_m_per_s"] = to_json_float(res_pipe.iloc[pipe_idx].get("v_mean_m_per_s"))

            elif edge_type == "valve":
                valve_idx = len([e for e in original_data.get("edges", [])[:i] if e["type"] == "valve"])
                res_valve = getattr(net, "res_valve", None)
                if res_valve is not None and valve_idx < len(res_valve):
                    result["mdot_kg_per_s"] = to_json_float(res_valve.iloc[valve_idx].get("mdot_from_kg_per_s"))

            elif edge_type == "flow_control":
                fc_idx = len([e for e in original_data.get("edges", [])[:i] if e["type"] == "flow_control"])
                res_flow_control = getattr(net, "res_flow_control", None)
                if res_flow_control is not None and fc_idx < len(res_flow_control):
                    result["mdot_kg_per_s"] = to_json_float(res_flow_control.iloc[fc_idx].get("mdot_from_kg_per_s"))

            elif edge_type == "pressure_control":
                pc_idx = len([e for e in original_data.get("edges", [])[:i] if e["type"] == "pressure_control"])
                res_pressure_control = getattr(net, "res_pressure_control", None)
                if res_pressure_control is not None and pc_idx < len(res_pressure_control):
                    result["mdot_kg_per_s"] = to_json_float(res_pressure_control.iloc[pc_idx].get("mdot_from_kg_per_s"))

            elif edge_type == "compressor":
                comp_idx = len([e for e in original_data.get("edges", [])[:i] if e["type"] == "compressor"])
                res_compressor = getattr(net, "res_compressor", None)
                if res_compressor is not None and comp_idx < len(res_compressor):
                    result["mdot_kg_per_s"] = to_json_float(res_compressor.iloc[comp_idx].get("mdot_from_kg_per_s"))

            elif edge_type == "heat_exchanger":
                he_idx = len([e for e in original_data.get("edges", [])[:i] if e["type"] == "heat_exchanger"])
                res_heat_exchanger = getattr(net, "res_heat_exchanger", None)
                if res_heat_exchanger is not None and he_idx < len(res_heat_exchanger):
                    result["mdot_kg_per_s"] = to_json_float(res_heat_exchanger.iloc[he_idx].get("mdot_from_kg_per_s"))

            edge_results.append(result)

        return {
            "nodes": node_results,
            "edges": edge_results,
            "success": True,
            "message": "Simulation completed successfully"
        }
        
    except Exception as e:
        return {
            "nodes": [],
            "edges": [],
            "success": False,
            "message": f"Simulation failed: {str(e)}"
        }