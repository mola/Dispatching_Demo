import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from 'reactflow';
import { EdgeProps } from 'reactflow';

export const HeatExchangerEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps) => {
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
          stroke: selected ? '#007bff' : '#fd7e14',
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
            <span style={{ color: '#fd7e14' }}>
              ⬛
            </span>
            <span>Heat Exchanger</span>
            {data?.params?.qext_w && (
              <span style={{ fontSize: '10px', color: '#666' }}>
                ({data.params.qext_w.toFixed(1)} W)
              </span>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};