import React from 'react';
import { Handle, Position } from 'reactflow';

interface CircPumpMassFlowNodeProps {
  data: any;
  selected?: boolean;
}

export const CircPumpMassFlowNode: React.FC<CircPumpMassFlowNodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: '10px',
        border: selected ? '2px solid #007bff' : '2px solid #ccc',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div
        style={{
          width: '30px',
          height: '30px',
          border: '2px solid #6c757d',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
        }}
      >
        <span style={{ fontSize: '16px', color: '#6c757d' }}>◯</span>
      </div>
      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
    </div>
  );
};