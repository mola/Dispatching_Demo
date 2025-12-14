import React, { useState } from 'react';
import { Node, Edge } from 'reactflow';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
  onUpdateEdge: (edgeId: string, updates: any) => void;
  onDeleteSelected: () => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteSelected,
}) => {
  const [label, setLabel] = useState('');
  const [params, setParams] = useState<any>({});

  React.useEffect(() => {
    if (selectedNode) {
      setLabel(selectedNode.data.label);
      setParams(selectedNode.data.params);
    } else if (selectedEdge) {
      setParams(selectedEdge.data.params);
    }
  }, [selectedNode, selectedEdge]);

  const handleUpdateNode = () => {
    if (selectedNode) {
      onUpdateNode(selectedNode.id, {
        data: {
          label,
          params,
          nodeType: selectedNode.data.nodeType,
        },
      });
    }
  };

  const handleUpdateEdge = () => {
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, {
        data: {
          ...selectedEdge.data,
          params,
        },
      });
    }
  };

  const handleParamChange = (key: string, value: any) => {
    setParams((prev: any) => ({ ...prev, [key]: value }));
  };

  if (!selectedNode && !selectedEdge) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '10px',
          width: '250px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          Properties
        </div>
        <div style={{ color: '#666' }}>
          Select a node or edge to view properties
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '10px',
        width: '250px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        Properties
      </div>

      {selectedNode && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <strong>Type:</strong> {selectedNode.data.nodeType}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Label:
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
              }}
            />
          </div>

          {/* Node-specific parameters */}
          {selectedNode.data.nodeType === 'external_grid' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Pressure (bar):
                </label>
                <input
                  type="number"
                  value={params.p_bar || ''}
                  onChange={(e) => handleParamChange('p_bar', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Temperature (K):
                </label>
                <input
                  type="number"
                  value={params.t_k || ''}
                  onChange={(e) => handleParamChange('t_k', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'source' && (
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>
                Mass Flow (kg/s):
              </label>
              <input
                type="number"
                value={params.mdot_kg_per_s || ''}
                onChange={(e) => handleParamChange('mdot_kg_per_s', parseFloat(e.target.value))}
                style={{
                  width: '100%',
                  padding: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                }}
              />
            </div>
          )}

          {selectedNode.data.nodeType === 'sink' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Demand (kg/s):
                </label>
                <input
                  type="number"
                  value={params.demand_kg_per_s || ''}
                  onChange={(e) => handleParamChange('demand_kg_per_s', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Min Pressure (bar):
                </label>
                <input
                  type="number"
                  value={params.p_min_bar || ''}
                  onChange={(e) => handleParamChange('p_min_bar', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>

              {typeof selectedNode.data.pressureBar === 'number' && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '10px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#495057' }}>
                    Simulation Results:
                  </div>
                  
                  <div style={{ marginBottom: '5px' }}>
                    <strong>Actual Pressure:</strong> 
                    <span style={{ 
                      marginLeft: '5px',
                      color: selectedNode.data.status === 'OK' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {Number(selectedNode.data.pressureBar).toFixed(3)} bar
                    </span>
                  </div>
                  
                  <div>
                    <strong>Status:</strong>
                    <span style={{ 
                      marginLeft: '5px',
                      color: selectedNode.data.status === 'OK' ? '#28a745' : '#dc3545',
                      fontWeight: 'bold'
                    }}>
                      {selectedNode.data.status === 'OK' ? '✓ Pressure OK' : '✗ Pressure Too Low'}
                    </span>
                  </div>
                  
                  {selectedNode.data.status === 'pressure too low' && (
                    <div style={{ 
                      marginTop: '5px', 
                      fontSize: '12px', 
                      color: '#6c757d' 
                    }}>
                      Required: {params.p_min_bar} bar, 
                      Actual: {Number(selectedNode.data.pressureBar).toFixed(3)} bar
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {selectedNode.data.nodeType === 'valve' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Diameter (m):
                </label>
                <input
                  type="number"
                  value={params.diameter_m || ''}
                  onChange={(e) => handleParamChange('diameter_m', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="checkbox"
                    checked={params.opened !== false}
                    onChange={(e) => handleParamChange('opened', e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  Opened
                </label>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Loss Coefficient:
                </label>
                <input
                  type="number"
                  value={params.loss_coefficient || ''}
                  onChange={(e) => handleParamChange('loss_coefficient', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'pump' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Pressure Ratio:
                </label>
                <input
                  type="number"
                  value={params.pressure_ratio || ''}
                  onChange={(e) => handleParamChange('pressure_ratio', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Efficiency:
                </label>
                <input
                  type="number"
                  value={params.eta || ''}
                  onChange={(e) => handleParamChange('eta', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'circ_pump_mass_flow' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Mass Flow (kg/s):
                </label>
                <input
                  type="number"
                  value={params.mdot_flow_kg_per_s || ''}
                  onChange={(e) => handleParamChange('mdot_flow_kg_per_s', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Flow Pressure (bar):
                </label>
                <input
                  type="number"
                  value={params.p_flow_bar || ''}
                  onChange={(e) => handleParamChange('p_flow_bar', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Flow Temperature (K):
                </label>
                <input
                  type="number"
                  value={params.t_flow_k || ''}
                  onChange={(e) => handleParamChange('t_flow_k', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'circ_pump_const_pressure' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Flow Pressure (bar):
                </label>
                <input
                  type="number"
                  value={params.p_flow_bar || ''}
                  onChange={(e) => handleParamChange('p_flow_bar', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Pressure Lift (bar):
                </label>
                <input
                  type="number"
                  value={params.plift_bar || ''}
                  onChange={(e) => handleParamChange('plift_bar', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'compressor' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Pressure Ratio:
                </label>
                <input
                  type="number"
                  value={params.pressure_ratio || ''}
                  onChange={(e) => handleParamChange('pressure_ratio', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'mass_storage' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Mass Flow (kg/s):
                </label>
                <input
                  type="number"
                  value={params.mdot_kg_per_s || ''}
                  onChange={(e) => handleParamChange('mdot_kg_per_s', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Initial Stored Mass (kg):
                </label>
                <input
                  type="number"
                  value={params.init_m_stored_kg || ''}
                  onChange={(e) => handleParamChange('init_m_stored_kg', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Minimum Stored Mass (kg):
                </label>
                <input
                  type="number"
                  value={params.min_m_stored_kg || ''}
                  onChange={(e) => handleParamChange('min_m_stored_kg', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Maximum Stored Mass (kg):
                </label>
                <input
                  type="number"
                  value={params.max_m_stored_kg || ''}
                  onChange={(e) => handleParamChange('max_m_stored_kg', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'heat_exchanger' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Diameter (m):
                </label>
                <input
                  type="number"
                  value={params.diameter_m || ''}
                  onChange={(e) => handleParamChange('diameter_m', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  External Heat Transfer (W):
                </label>
                <input
                  type="number"
                  value={params.qext_w || ''}
                  onChange={(e) => handleParamChange('qext_w', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedEdge && (selectedEdge.type === 'flow_control' || selectedEdge.type === 'pressure_control') && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Diameter (m):
                </label>
                <input
                  type="number"
                  value={params.diameter_m || ''}
                  onChange={(e) => handleParamChange('diameter_m', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  {selectedEdge.type === 'flow_control' ? 'Controlled Flow (kg/s):' : 'Controlled Pressure (bar):'}
                </label>
                <input
                  type="number"
                  value={selectedEdge.type === 'flow_control' ? (params.controlled_mdot_kg_per_s || '') : (params.controlled_p_bar || '')}
                  onChange={(e) => handleParamChange(selectedEdge.type === 'flow_control' ? 'controlled_mdot_kg_per_s' : 'controlled_p_bar', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="checkbox"
                    checked={params.control_active || false}
                    onChange={(e) => handleParamChange('control_active', e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  Control Active
                </label>
              </div>
            </>
          )}

          {selectedEdge && selectedEdge.type === 'compressor' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Pressure Ratio:
                </label>
                <input
                  type="number"
                  value={params.pressure_ratio || ''}
                  onChange={(e) => handleParamChange('pressure_ratio', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedEdge && selectedEdge.type === 'heat_exchanger' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Diameter (m):
                </label>
                <input
                  type="number"
                  value={params.diameter_m || ''}
                  onChange={(e) => handleParamChange('diameter_m', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  External Heat Transfer (W):
                </label>
                <input
                  type="number"
                  value={params.qext_w || ''}
                  onChange={(e) => handleParamChange('qext_w', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
            </>
          )}

          {selectedNode.data.nodeType === 'junction' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Nominal Pressure (bar):
                </label>
                <input
                  type="number"
                  value={params.pn_bar || ''}
                  onChange={(e) => handleParamChange('pn_bar', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Fluid Temperature (K):
                </label>
                <input
                  type="number"
                  value={params.tfluid_k || ''}
                  onChange={(e) => handleParamChange('tfluid_k', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>
                  Height (m):
                </label>
                <input
                  type="number"
                  value={params.height_m || ''}
                  onChange={(e) => handleParamChange('height_m', parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '3px',
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <input
                    type="checkbox"
                    checked={params.in_service || false}
                    onChange={(e) => handleParamChange('in_service', e.target.checked)}
                    style={{ marginRight: '5px' }}
                  />
                  In Service
                </label>
              </div>
            </>
          )}

          <button
            onClick={handleUpdateNode}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              marginBottom: '5px',
            }}
          >
            Update Node
          </button>
        </>
      )}

      {selectedEdge && (
        <>
          <div style={{ marginBottom: '10px' }}>
            <strong>Type:</strong> {selectedEdge.type}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Length (m):
            </label>
            <input
              type="number"
              value={params.length_m || ''}
              onChange={(e) => handleParamChange('length_m', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Diameter (m):
            </label>
            <input
              type="number"
              value={params.diameter_m || ''}
              onChange={(e) => handleParamChange('diameter_m', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Roughness (m):
            </label>
            <input
              type="number"
              value={params.roughness_m || ''}
              onChange={(e) => handleParamChange('roughness_m', parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '3px',
              }}
            />
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={params.in_service || false}
                onChange={(e) => handleParamChange('in_service', e.target.checked)}
                style={{ marginRight: '5px' }}
              />
              In Service
            </label>
          </div>

          <button
            onClick={handleUpdateEdge}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer',
              marginBottom: '5px',
            }}
          >
            Update Edge
          </button>
        </>
      )}

      <button
        onClick={onDeleteSelected}
        style={{
          width: '100%',
          padding: '8px',
          backgroundColor: '#dc3545',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        Delete
      </button>
    </div>
  );
};