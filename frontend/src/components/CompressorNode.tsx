import React from 'react';
import { Handle, Position } from 'reactflow';

interface CompressorNodeProps {
  data: any;
  selected?: boolean;
}

export const CompressorNode: React.FC<CompressorNodeProps> = ({ data, selected }) => {
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
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div
        style={{
          width: '30px',
          height: '30px',
          border: '2px solid #17a2b8',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#e3f2fd',
        }}
      >
        <span style={{ fontSize: '16px', color: '#17a2b8' }}>⬢</span>
      </div>
      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
    </div>
  );
};