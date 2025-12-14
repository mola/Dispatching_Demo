import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Connection,
  Background,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { JunctionNode } from './JunctionNode';
import { ExternalGridNode } from './ExternalGridNode';
import { SourceNode } from './SourceNode';
import { SinkNode } from './SinkNode';
import { PumpNode } from './PumpNode';
import { ValveEdge } from './ValveEdge';
import { ValveNode } from './ValveNode';
import { CircPumpMassFlowNode } from './CircPumpMassFlowNode';
import { CircPumpConstPressureNode } from './CircPumpConstPressureNode';
import { CompressorNode } from './CompressorNode';
import { MassStorageNode } from './MassStorageNode';
import { HeatExchangerNode } from './HeatExchangerNode';
import { FlowControlEdge } from './FlowControlEdge';
import { PressureControlEdge } from './PressureControlEdge';
import { CompressorEdge } from './CompressorEdge';
import { HeatExchangerEdge } from './HeatExchangerEdge';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { NetworkData, SimulationResults } from '../types';

const nodeTypes = {
  junction: JunctionNode,
  external_grid: ExternalGridNode,
  source: SourceNode,
  sink: SinkNode,
  pump: PumpNode,
  circ_pump_mass_flow: CircPumpMassFlowNode,
  circ_pump_const_pressure: CircPumpConstPressureNode,
  compressor: CompressorNode,
  mass_storage: MassStorageNode,
  heat_exchanger: HeatExchangerNode,
  valve: ValveNode,
};

const edgeTypes = {
  valve: ValveEdge,
  flow_control: FlowControlEdge,
  pressure_control: PressureControlEdge,
  compressor: CompressorEdge,
  heat_exchanger: HeatExchangerEdge,
};

interface CanvasEditorProps {
  onRunSimulation: (network: NetworkData) => void;
  simulationResults?: SimulationResults;
  onLoadNetwork: () => void;
  initialNetwork?: NetworkData; // New prop to load initial network
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  onRunSimulation,
  simulationResults,
  onLoadNetwork: onLoadNetworkProp,
  initialNetwork,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [edgeCounter, setEdgeCounter] = useState(1);

  // Load initial network if provided
  useEffect(() => {
    if (initialNetwork) {
      const loadedNodes: Node[] = initialNetwork.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: { x: node.x, y: node.y },
        data: {
          label: (node.params as any)?.label || `${node.type}_${node.id}`,
          nodeType: node.type,
          params: node.params,
        },
      }));

      const nodePos = new Map<string, { x: number; y: number }>();
      loadedNodes.forEach((n) => nodePos.set(n.id, n.position));

      const expandedNodes: Node[] = [...loadedNodes];
      const expandedEdges: Edge[] = [];

      initialNetwork.edges.forEach((edge) => {
        if (edge.type === 'valve') {
          const sourcePos = nodePos.get(edge.from_node);
          const targetPos = nodePos.get(edge.to_node);
          const x = sourcePos && targetPos ? (sourcePos.x + targetPos.x) / 2 : 0;
          const y = sourcePos && targetPos ? (sourcePos.y + targetPos.y) / 2 : 0;

          const valveNodeId = `v_${edge.id}`;

          const edgeValveParams = edge.params || {};

          expandedNodes.push({
            id: valveNodeId,
            type: 'valve',
            position: { x, y },
            data: {
              label: `valve_${edge.id}`,
              nodeType: 'valve',
              params: {
                ...edgeValveParams,
                diameter_m: edgeValveParams.diameter_m ?? 0.05,
                opened: edgeValveParams.opened ?? true,
                loss_coefficient: edgeValveParams.loss_coefficient ?? 0.0,
              },
            },
          });

          expandedEdges.push({
            id: `${edge.id}_c1`,
            source: edge.from_node,
            target: valveNodeId,
            type: 'smoothstep',
            data: { edgeType: 'connector', params: {} },
          });

          expandedEdges.push({
            id: `${edge.id}_c2`,
            source: valveNodeId,
            target: edge.to_node,
            type: 'smoothstep',
            data: { edgeType: 'connector', params: {} },
          });

          return;
        }

        expandedEdges.push({
          id: edge.id,
          source: edge.from_node,
          target: edge.to_node,
          type: edge.type === 'pipe' ? 'smoothstep' : edge.type,
          data: {
            edgeType: edge.type,
            params: edge.params,
          },
        });
      });

      setNodes(expandedNodes);
      setEdges(expandedEdges);
      
      // Update counters to avoid ID conflicts
      const maxNodeId = Math.max(...expandedNodes.map(n => parseInt(n.id.replace(/\D/g, '')) || 0), 0);
      const maxEdgeId = Math.max(...expandedEdges.map(e => parseInt(e.id.replace(/\D/g, '')) || 0), 0);
      setNodeCounter(maxNodeId + 1);
      setEdgeCounter(maxEdgeId + 1);
    }
  }, [initialNetwork]);

  const onConnect = useCallback(
    (params: Connection) => {
      const edgeTools = new Set([
        'pipe',
        'flow_control',
        'pressure_control',
        'compressor',
        'heat_exchanger',
      ]);

      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      const isValveConnector =
        sourceNode?.data?.nodeType === 'valve' || targetNode?.data?.nodeType === 'valve';

      const tool = isValveConnector
        ? 'connector'
        : selectedTool && edgeTools.has(selectedTool)
          ? selectedTool
          : 'pipe';

      const renderType = tool === 'pipe' || tool === 'connector' ? 'smoothstep' : tool;

      const newEdge: Edge = {
        id: `e${edgeCounter}`,
        source: params.source!,
        target: params.target!,
        type: renderType,
        data: {
          edgeType: tool,
          params: tool === 'connector' ? {} : getEdgeParams(tool),
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      setEdgeCounter((prev) => prev + 1);
    },
    [nodes, selectedTool, edgeCounter, setEdges]
  );

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const edgeTools = new Set([
        'pipe',
        'flow_control',
        'pressure_control',
        'compressor',
        'heat_exchanger',
      ]);

      if (selectedTool && !edgeTools.has(selectedTool) && reactFlowWrapper.current) {
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const newNode: Node = {
          id: `n${nodeCounter}`,
          type: selectedTool,
          position: { x, y },
          data: {
            label: `${selectedTool}_${nodeCounter}`,
            nodeType: selectedTool,
            params: getDefaultParams(selectedTool),
          },
        };

        setNodes((nds) => [...nds, newNode]);
        setNodeCounter((prev) => prev + 1);
        setSelectedTool(null);
      }
    },
    [selectedTool, nodeCounter, setNodes]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setSelectedEdge(null);
    },
    []
  );

  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge);
      setSelectedNode(null);
    },
    []
  );

  const onUpdateNode = useCallback(
    (nodeId: string, updates: any) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: { ...node.data, ...updates.data },
              }
            : node
        )
      );
    },
    [setNodes]
  );

  const onUpdateEdge = useCallback(
    (edgeId: string, updates: any) => {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === edgeId
            ? {
                ...edge,
                data: { ...edge.data, ...updates.data },
              }
            : edge
        )
      );
    },
    [setEdges]
  );

  const onDeleteSelected = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
    } else if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
    }
  }, [selectedNode, selectedEdge, setNodes, setEdges]);

  const handleRunSimulation = useCallback(() => {
    const network = buildNetworkForBackend(nodes, edges);
    onRunSimulation(network);
  }, [nodes, edges, onRunSimulation]);

  const onSaveNetwork = useCallback(() => {
    const network = buildNetworkForStorage(nodes, edges);

    const name = prompt('Enter network name:');
    if (name) {
      saveNetworkToServer(name, network);
    }
  }, [nodes, edges]);

  // Apply simulation results to nodes
  React.useEffect(() => {
    if (simulationResults) {
      setNodes((nds) => {
        const cleared = nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            border: undefined,
          },
          data: {
            ...node.data,
            pressureBar: undefined,
            status: undefined,
          },
        }));

        if (!simulationResults.success || simulationResults.nodes.length === 0) {
          return cleared;
        }

        return cleared.map((node) => {
          const result = simulationResults.nodes.find((r) => r.id === node.id);
          if (result) {
            const color = result.status === 'OK' ? '#28a745' :
                          result.status === 'pressure too low' ? '#dc3545' : '#ffc107';

            return {
              ...node,
              style: {
                ...node.style,
                border: `2px solid ${color}`,
              },
              data: {
                ...node.data,
                pressureBar: result.pressure_bar,
                status: result.status,
              },
            };
          }
          return node;
        });
      });
    }
  }, [simulationResults, setNodes]);

  return (
    <div style={{ width: '100vw', height: '100vh' }} ref={reactFlowWrapper}>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <marker
            id="reactflow__arrowclosed"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M0,0 L0,6 L9,3 z"
              fill="#666"
            />
          </marker>
        </defs>
      </svg>
      
      <Toolbar
        selectedTool={selectedTool}
        onToolSelect={setSelectedTool}
        onRunSimulation={handleRunSimulation}
        onSaveNetwork={onSaveNetwork}
        onLoadNetwork={onLoadNetworkProp}
      />
      
      <PropertiesPanel
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onUpdateNode={onUpdateNode}
        onUpdateEdge={onUpdateEdge}
        onDeleteSelected={onDeleteSelected}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={onPaneClick}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        nodeTypes={nodeTypes as any}
        edgeTypes={edgeTypes as any}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

function getDefaultParams(nodeType: string): any {
  switch (nodeType) {
    case 'external_grid':
      return { p_bar: 50.0, t_k: 293.15 };
    case 'source':
      return { mdot_kg_per_s: 1.0 };
    case 'sink':
      return { demand_kg_per_s: 1.0, p_min_bar: 20.0 };
    case 'pump':
      return { pressure_ratio: 1.5, eta: 0.8 };
    case 'valve':
      return { diameter_m: 0.05, opened: true, loss_coefficient: 0.0 };
    case 'junction':
    default:
      return {};
  }
}

function getEdgeParams(edgeType: string): any {
  switch (edgeType) {
    case 'pipe':
      return { length_m: 1000, diameter_m: 0.1, roughness_m: 1e-5, in_service: true };
    case 'valve':
      return { diameter_m: 0.05, opened: true };
    case 'flow_control':
      return { controlled_mdot_kg_per_s: 1.0, diameter_m: 0.1, control_active: true };
    case 'pressure_control':
      return { controlled_p_bar: 1.0, diameter_m: 0.1, control_active: true };
    case 'compressor':
      return { pressure_ratio: 1.5 };
    case 'heat_exchanger':
      return { diameter_m: 0.1, qext_w: 0.0 };
    default:
      return { length_m: 1000, diameter_m: 0.1, roughness_m: 1e-5, in_service: true };
  }
}

function buildNetworkForBackend(nodes: Node[], edges: Edge[]): NetworkData {
  const valveNodes = nodes.filter((n) => n.data?.nodeType === 'valve');
  const nonValveNodes = nodes.filter((n) => n.data?.nodeType !== 'valve');

  const backendNodes = nonValveNodes.map((node) => ({
    id: node.id,
    type: node.data.nodeType,
    x: node.position.x,
    y: node.position.y,
    params: node.data.params,
  }));

  const connectorEdges = edges.filter((e) => e.data?.edgeType === 'connector');

  const backendEdges: any[] = [];

  edges.forEach((edge) => {
    if (edge.data?.edgeType === 'connector') {
      return;
    }

    const edgeType = edge.data?.edgeType || 'pipe';

    backendEdges.push({
      id: edge.id,
      from_node: edge.source,
      to_node: edge.target,
      type: edgeType,
      params: edge.data?.params || getEdgeParams(edgeType),
    });
  });

  valveNodes.forEach((valveNode) => {
    const adjacentConnectors = connectorEdges.filter(
      (e) => e.source === valveNode.id || e.target === valveNode.id
    );

    if (adjacentConnectors.length !== 2) {
      return;
    }

    const endpoints = adjacentConnectors.map((e) => (e.source === valveNode.id ? e.target : e.source));
    if (endpoints.length !== 2) {
      return;
    }

    const from_node = endpoints[0];
    const to_node = endpoints[1];

    const valveParams = (valveNode.data?.params || {}) as any;

    backendEdges.push({
      id: `e_valve_${valveNode.id}`,
      from_node,
      to_node,
      type: 'valve',
      params: {
        ...valveParams,
        diameter_m: valveParams.diameter_m ?? 0.05,
        opened: valveParams.opened ?? true,
        loss_coefficient: valveParams.loss_coefficient ?? 0.0,
      },
    });
  });

  return {
    name: 'Current Network',
    nodes: backendNodes,
    edges: backendEdges,
  };
}

function buildNetworkForStorage(nodes: Node[], edges: Edge[]): NetworkData {
  return buildNetworkForBackend(nodes, edges);
}

async function saveNetworkToServer(name: string, network: NetworkData) {
  try {
    const response = await fetch('/api/networks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        description: '',
        network,
      }),
    });
    
    if (response.ok) {
      const result = await response.json();
      alert(`Network saved with ID: ${result.id}`);
    } else {
      alert('Failed to save network');
    }
  } catch (error) {
    alert('Error saving network');
  }
}

