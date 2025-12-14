import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';
import { EdgeProps } from 'reactflow';

export const FlowControlEdge: React.FC<EdgeProps> = ({
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
          stroke: selected ? '#007bff' : '#666',
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: data?.params?.control_active ? '5,5' : 'none',
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
            <span style={{ color: data?.params?.control_active ? '#28a745' : '#dc3545' }}>
              ⚙
            </span>
            <span>Flow Control</span>
            <span style={{ fontSize: '10px', color: '#666' }}>
              ({data?.params?.controlled_mdot_kg_per_s || 0} kg/s)
            </span>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};