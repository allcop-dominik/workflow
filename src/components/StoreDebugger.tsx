import { useWorkflowStore } from '../store/workflowStore';

// Simple test component to debug store state
const StoreDebugger = () => {
  const { nodes, edges } = useWorkflowStore();

  return (
    <div className="fixed bottom-20 left-4 bg-black text-white p-2 text-xs">
      <div>Nodes: {nodes.length}</div>
      <div>Edges: {edges.length}</div>
      <div>Node IDs: {nodes.map(n => n.id).join(', ')}</div>
    </div>
  );
};

export default StoreDebugger;