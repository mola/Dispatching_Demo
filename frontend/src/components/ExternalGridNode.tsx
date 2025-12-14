import React from 'react';
import { Handle, Position } from 'reactflow';

interface ExternalGridNodeProps {
  data: any;
  selected?: boolean;
}

export const ExternalGridNode: React.FC<ExternalGridNodeProps> = ({ data, selected }) => {
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
      <Handle id="t" type="source" position={Position.Top} />
      <Handle id="b" type="source" position={Position.Bottom} />
      <Handle id="l" type="source" position={Position.Left} />
      <Handle id="r" type="source" position={Position.Right} />
      <div
        style={{
          width: '20px',
          height: '20px',
          backgroundColor: '#333',
          borderRadius: '50%',
        }}
      />
      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
    </div>
  );
};