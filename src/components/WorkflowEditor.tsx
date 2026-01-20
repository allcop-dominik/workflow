import { memo, useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  Panel,
  ConnectionLineType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useWorkflowStore } from '../store/workflowStore';
import AvatarStepNode from './AvatarStepNode';
import BranchNodeComponent from './BranchNode';
import ComputationNodeComponent from './ComputationNode';
import StartNode from './StartNode';
import EndNode from './EndNode';
import CustomEdge from './CustomEdge';
import GuardrailSidebar from './GuardrailSidebar';
import ExportButton from './ExportButton';

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  avatarStep: AvatarStepNode,
  branch: BranchNodeComponent,
  computation: ComputationNodeComponent,
};

const edgeTypes = {
  default: CustomEdge,
};

const NodePalette = () => {
  const { screenToFlowPosition } = useReactFlow();
  const { addNode, validateWorkflow } = useWorkflowStore();

  const getViewportCenterPosition = useCallback(() => {
    const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();

    if (!reactFlowBounds) {
      return { x: 400, y: 300 };
    }

    const centerX = reactFlowBounds.width / 2;
    const centerY = reactFlowBounds.height / 2;

    const offsetX = (Math.random() - 0.5) * 200;
    const offsetY = (Math.random() - 0.5) * 200;

    return screenToFlowPosition({
      x: centerX + offsetX,
      y: centerY + offsetY,
    });
  }, [screenToFlowPosition]);

  const handleAddAvatarStep = useCallback(() => {
    const position = getViewportCenterPosition();
    addNode('avatarStep', position);
    setTimeout(() => {
      validateWorkflow();
    }, 100);
  }, [addNode, validateWorkflow, getViewportCenterPosition]);

  const handleAddBranch = useCallback(() => {
    const position = getViewportCenterPosition();
    addNode('branch', position);
    setTimeout(() => {
      validateWorkflow();
    }, 100);
  }, [addNode, validateWorkflow, getViewportCenterPosition]);

  const handleAddComputation = useCallback(() => {
    const position = getViewportCenterPosition();
    addNode('computation', position);
    setTimeout(() => {
      validateWorkflow();
    }, 100);
  }, [addNode, validateWorkflow, getViewportCenterPosition]);

  const handleAddEnd = useCallback(() => {
    const position = getViewportCenterPosition();
    addNode('end', position);
    setTimeout(() => {
      validateWorkflow();
    }, 100);
  }, [addNode, validateWorkflow, getViewportCenterPosition]);

  return (
    <>
      <Panel position="top-left" className="bg-white rounded-lg shadow-sm p-2 max-w-[160px]">
        <h3 className="font-semibold text-gray-800 mb-1.5 text-xs">Add Nodes</h3>
        <div className="space-y-1">
          <button
            onClick={handleAddAvatarStep}
            className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
          >
            + Avatar Step
          </button>
          <button
            onClick={handleAddBranch}
            className="w-full px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
          >
            + Branch Node
          </button>
          <button
            onClick={handleAddComputation}
            className="w-full px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs"
          >
            + Computation Node
          </button>
          <button
            onClick={handleAddEnd}
            className="w-full px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs"
          >
            + End Node
          </button>
        </div>
      </Panel>

      <Panel position="top-right" className="bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-2">Instructions</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Click "Add Nodes" to create workflow steps</li>
          <li>• Drag connections between nodes to create flow</li>
          <li>• Hover over edges or click delete buttons to remove connections</li>
          <li>• Configure avatar steps with videos and questions</li>
          <li>• Use computation nodes for calculations (e.g., BMI)</li>
          <li>• Use branch nodes for conditional logic</li>
          <li>• Fix all violations before exporting</li>
        </ul>
      </Panel>
    </>
  );
};

NodePalette.displayName = 'NodePalette';

const WorkflowEditor = memo(() => {
  const edgeReconnectSuccessful = useRef(true);
  const {
    nodes,
    edges,
    onConnect,
    onNodesChange,
    onEdgesChange,
    reconnectEdge,
    deleteEdge,
  } = useWorkflowStore();

  const handleConnect = useCallback((params: Connection) => {
    onConnect(params);
  }, [onConnect]);

  const handleReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const handleReconnect = useCallback((oldEdge: Edge, newConnection: Connection) => {
    edgeReconnectSuccessful.current = true;
    reconnectEdge(oldEdge, newConnection);
  }, [reconnectEdge]);

  const handleReconnectEnd = useCallback((_: unknown, edge: Edge) => {
    if (!edgeReconnectSuccessful.current) {
      deleteEdge(edge.id);
    }
    edgeReconnectSuccessful.current = true;
  }, [deleteEdge]);

  return (
    <div className="w-full h-screen bg-gray-50 text-gray-900">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        onReconnectStart={handleReconnectStart}
        onReconnect={handleReconnect}
        onReconnectEnd={handleReconnectEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        edgesFocusable
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
        minZoom={0.1}
        maxZoom={4}
        snapToGrid
        className="bg-gray-50"
        connectionRadius={50}
        connectionLineStyle={{ strokeWidth: 3, stroke: '#3b82f6' }}
        connectionLineType={ConnectionLineType.SmoothStep}
      >
        <Background />
        <Controls />
        <MiniMap
          nodeStrokeColor="#1a1a1a"
          nodeColor="#ffffff"
          nodeBorderRadius={8}
        />
        <NodePalette />
      </ReactFlow>

      <GuardrailSidebar />
      <ExportButton />
    </div>
  );
});

WorkflowEditor.displayName = 'WorkflowEditor';

export default WorkflowEditor;
