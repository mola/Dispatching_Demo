import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';
import { EdgeProps } from 'reactflow';

export const CompressorEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd="url(#reactflow__arrowclosed)"
        style={{
          stroke: selected ? '#007bff' : '#17a2b8',
          strokeWidth: selected ? 3 : 2,
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            backgroundColor: 'white',
            border: selected ? '2px solid #007bff' : '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px 8px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
          className="nodrag nopan"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#17a2b8' }}>
              ⬢
            </span>
            <span>Compressor</span>
            <span style={{ fontSize: '10px', color: '#666' }}>
              (×{data?.params?.pressure_ratio || 1})
            </span>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};