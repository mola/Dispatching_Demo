import React from 'react';
import { Handle, Position } from 'reactflow';

interface SinkNodeProps {
  data: any;
  selected?: boolean;
}

export const SinkNode: React.FC<SinkNodeProps> = ({ data, selected }) => {
  const pressureBar = typeof data.pressureBar === 'number' ? data.pressureBar : null;
  const status = data.status;
  
  // Determine border color based on status
  const borderColor = selected ? '#007bff' : 
                     status === 'OK' ? '#28a745' : 
                     status === 'pressure too low' ? '#dc3545' : '#ccc';

  return (
    <div
      style={{
        padding: '10px',
        border: `2px solid ${borderColor}`,
        borderRadius: '4px',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        position: 'relative',
      }}
    >
      <Handle id="t" type="target" position={Position.Top} />
      <Handle id="b" type="target" position={Position.Bottom} />
      <Handle id="l" type="target" position={Position.Left} />
      <Handle id="r" type="target" position={Position.Right} />
      <div
        style={{
          width: '25px',
          height: '20px',
          border: '2px solid #dc3545',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 0,
            height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: '10px solid #dc3545',
          }}
        />
      </div>
      <div style={{ position: 'absolute', top: '-20px', fontSize: '10px' }}>
        {data.label}
      </div>
      {pressureBar !== null && (
        <div
          style={{
            position: 'absolute',
            bottom: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '9px',
            fontWeight: 'bold',
            color: status === 'OK' ? '#28a745' : status === 'pressure too low' ? '#dc3545' : '#666',
            backgroundColor: 'white',
            padding: '1px 3px',
            borderRadius: '2px',
            border: `1px solid ${status === 'OK' ? '#28a745' : status === 'pressure too low' ? '#dc3545' : '#ccc'}`,
            whiteSpace: 'nowrap',
          }}
        >
          {pressureBar.toFixed(2)} bar
        </div>
      )}
    </div>
  );
};