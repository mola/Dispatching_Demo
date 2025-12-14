import React from 'react';
import { Handle, Position } from 'reactflow';

interface ValveNodeProps {
  data: any;
  selected?: boolean;
}

export const ValveNode: React.FC<ValveNodeProps> = ({ data, selected }) => {
  const opened = data?.params?.opened !== false;

  return (
    <div
      style={{
        padding: '10px',
        border: selected ? '2px solid #007bff' : '2px solid #ccc',
        borderRadius: '4px',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        position: 'relative',
      }}
    >
      <Handle id="in" type="target" position={Position.Left} />
      <Handle id="out" type="source" position={Position.Right} />

      <div
        style={{
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: opened ? '#28a745' : '#dc3545',
        }}
      >
        ◈
      </div>

      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
    </div>
  );
};
