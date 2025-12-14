import React from 'react';
import { Handle, Position } from 'reactflow';

interface SourceNodeProps {
  data: any;
  selected?: boolean;
}

export const SourceNode: React.FC<SourceNodeProps> = ({ data, selected }) => {
  return (
    <div
      style={{
        padding: '10px',
        border: selected ? '2px solid #007bff' : '2px solid #ccc',
        borderRadius: '4px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Handle type="source" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="source" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderBottom: '25px solid #28a745',
        }}
      />
      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
    </div>
  );
};