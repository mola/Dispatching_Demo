// Network element types
export interface NodeParams {
  [key: string]: any;
}

export interface NetworkNode {
  id: string;
  type: 'junction' | 'external_grid' | 'source' | 'sink' | 'pump' | 'circ_pump_mass_flow' | 'circ_pump_const_pressure' | 'compressor' | 'mass_storage' | 'heat_exchanger' | 'flow_control' | 'pressure_control';
  x: number;
  y: number;
  params: NodeParams;
}

export interface EdgeParams {
  length_m?: number;
  length_km?: number;
  diameter_m: number;
  roughness_m?: number;
  k_mm?: number;
  in_service?: boolean;
  opened?: boolean;
  pressure_ratio?: number;
  controlled_mdot_kg_per_s?: number;
  controlled_p_bar?: number;
  controlled_junction?: number;
  control_active?: boolean;
  loss_coefficient?: number;
  sections?: number;
  alpha_w_per_m2k?: number;
  text_k?: number;
  qext_w?: number;
  std_type?: string;
  pressure_list?: number[];
  flowrate_list?: number[];
  reg_polynomial_degree?: number;
  poly_coefficents?: number[];
  mdot_flow_kg_per_s?: number;
  t_flow_k?: number;
  p_flow_bar?: number;
  plift_bar?: number;
  scaling?: number;
  init_m_stored_kg?: number;
  min_m_stored_kg?: number;
  max_m_stored_kg?: number;
}

export interface NetworkEdge {
  id: string;
  from_node: string;
  to_node: string;
  type: 'pipe' | 'valve' | 'flow_control' | 'pressure_control' | 'heat_exchanger' | 'compressor';
  params: EdgeParams;
}

export interface NetworkData {
  name: string;
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

// React Flow types
export interface ReactFlowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    nodeType: string;
    params: NodeParams;
  };
}

export interface ReactFlowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  data: {
    params: EdgeParams;
  };
}

// Simulation results
export interface SimulationNodeResult {
  id: string;
  pressure_bar?: number;
  status?: string;
}

export interface SimulationEdgeResult {
  id: string;
  mdot_kg_per_s?: number;
  velocity_m_per_s?: number;
}

export interface SimulationResults {
  nodes: SimulationNodeResult[];
  edges: SimulationEdgeResult[];
  success: boolean;
  message?: string;
}

// Database network
export interface SavedNetwork {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}