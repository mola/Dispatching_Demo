import React from 'react';
import { Handle, Position } from 'reactflow';

interface JunctionNodeProps {
  data: any;
  selected?: boolean;
}

export const JunctionNode: React.FC<JunctionNodeProps> = ({ data, selected }) => {
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
          width: '20px',
          height: '20px',
          border: '2px solid #666',
          borderRadius: '50%',
        }}
      />
      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
    </div>
  );
};