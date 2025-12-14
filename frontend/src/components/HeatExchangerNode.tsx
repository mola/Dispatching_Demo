import React from 'react';
import { Handle, Position } from 'reactflow';

interface HeatExchangerNodeProps {
  data: any;
  selected?: boolean;
}

export const HeatExchangerNode: React.FC<HeatExchangerNodeProps> = ({ data, selected }) => {
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
          border: '2px solid #fd7e14',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff3cd',
        }}
      >
        <span style={{ fontSize: '16px', color: '#fd7e14' }}>⬛</span>
      </div>
      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
    </div>
  );
};