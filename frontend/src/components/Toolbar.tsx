import React from 'react';

interface ToolbarProps {
  selectedTool: string | null;
  onToolSelect: (tool: string | null) => void;
  onRunSimulation: () => void;
  onSaveNetwork: () => void;
  onLoadNetwork: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onRunSimulation,
  onSaveNetwork,
  onLoadNetwork,
}) => {
  const tools = [
    { id: 'junction', label: 'Junction', icon: '○' },
    { id: 'external_grid', label: 'External Grid', icon: '●' },
    { id: 'source', label: 'Source', icon: '△' },
    { id: 'sink', label: 'Sink', icon: '□→' },
    { id: 'pump', label: 'Pump', icon: '○+' },
    { id: 'circ_pump_mass_flow', label: 'Circ Pump (Mass)', icon: '◯' },
    { id: 'circ_pump_const_pressure', label: 'Circ Pump (Pressure)', icon: '◈' },
    { id: 'compressor', label: 'Compressor', icon: '⬢' },
    { id: 'mass_storage', label: 'Mass Storage', icon: '□' },
    { id: 'heat_exchanger', label: 'Heat Exchanger', icon: '⬛' },
    { id: 'pipe', label: 'Pipe', icon: '─' },
    { id: 'valve', label: 'Valve', icon: '◈' },
    { id: 'flow_control', label: 'Flow Control', icon: '⚙' },
    { id: 'pressure_control', label: 'Pressure Control', icon: '🎛' },
  ];

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      zIndex: 1000,
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      borderRadius: '4px',
      padding: '10px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        Tools
      </div>
      
      {tools.map(tool => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(selectedTool === tool.id ? null : tool.id)}
          style={{
            display: 'block',
            width: '100%',
            padding: '8px',
            margin: '2px 0',
            backgroundColor: selectedTool === tool.id ? '#007bff' : '#f8f9fa',
            color: selectedTool === tool.id ? '#fff' : '#333',
            border: '1px solid #ccc',
            borderRadius: '3px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ marginRight: '8px' }}>{tool.icon}</span>
          {tool.label}
        </button>
      ))}
      
      <div style={{ margin: '10px 0', borderTop: '1px solid #ccc' }} />
      
      <button
        onClick={onRunSimulation}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          margin: '2px 0',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        Run Simulation
      </button>
      
      <button
        onClick={onSaveNetwork}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          margin: '2px 0',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        Save Network
      </button>
      
      <button
        onClick={onLoadNetwork}
        style={{
          display: 'block',
          width: '100%',
          padding: '8px',
          margin: '2px 0',
          backgroundColor: '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      >
        Load Network
      </button>
    </div>
  );
};