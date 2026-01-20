import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useWorkflowStore } from '../store/workflowStore';
import type { BranchNode } from '../types/workflow';

const BranchNodeComponent = memo(({ id, data }: NodeProps) => {
  const { updateNodeData, deleteEdge, edges } = useWorkflowStore();

  const nodeData = data as BranchNode;

  const getConditionEdge = (conditionId: string) => {
    return edges.find(e => e.source === id && e.sourceHandle === conditionId);
  };

  const getConditionTarget = (conditionId: string) => {
    const edge = getConditionEdge(conditionId);
    return edge?.target || 'Not connected';
  };

  const handleDeleteEdge = (conditionId: string) => {
    const edge = getConditionEdge(conditionId);
    if (edge) {
      deleteEdge(edge.id);
    }
  };

  const addCondition = () => {
    const newCondition = {
      id: `condition_${Date.now()}`,
      variable: '',
      operator: '==' as const,
      value: '',
      targetNodeId: '',
    };

    updateNodeData(id, {
      conditions: [...nodeData.conditions, newCondition]
    });
  };

  const updateCondition = (conditionId: string, field: keyof typeof nodeData.conditions[0], value: string | number) => {
    const updatedConditions = nodeData.conditions.map(condition =>
      condition.id === conditionId
        ? { ...condition, [field]: value }
        : condition
    );

    updateNodeData(id, { conditions: updatedConditions });
  };

  const removeCondition = (conditionId: string) => {
    const updatedConditions = nodeData.conditions.filter(condition => condition.id !== conditionId);
    updateNodeData(id, { conditions: updatedConditions });
  };

  const generateConditionString = (condition: typeof nodeData.conditions[0]) => {
    if (!condition.variable || !condition.value) return 'Incomplete condition';
    return `${condition.variable} ${condition.operator} ${condition.value}`;
  };

  return (
    <div className="relative bg-white border-2 border-purple-300 rounded-lg shadow-lg w-72">
      <Handle
        type="target"
        position={Position.Top}
        className="w-2! h-2! bg-transparent! border-none! cursor-crosshair"
      />

      <div className="p-3">
        <div className="mb-2">
          <input
            type="text"
            value={nodeData.label}
            onChange={(e) => updateNodeData(id, { label: e.target.value })}
            placeholder="Branch node label"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          {nodeData.conditions.map((condition) => (
            <div key={condition.id} className="relative p-2 bg-purple-50 rounded border border-purple-200">
              <div className="flex items-center gap-1.5 mb-1.5 min-w-0">
                <input
                  type="text"
                  value={condition.variable}
                  onChange={(e) => updateCondition(condition.id, 'variable', e.target.value)}
                  placeholder="var"
                  className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <select
                  value={condition.operator}
                  onChange={(e) => updateCondition(condition.id, 'operator', e.target.value)}
                  className="w-14 shrink-0 px-1.5 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="==">==</option>
                  <option value="!=">!=</option>
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&gt;=</option>
                  <option value="<=">&lt;=</option>
                </select>
                <input
                  type="text"
                  value={condition.value}
                  onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
                  placeholder="value"
                  className="flex-1 min-w-0 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={() => removeCondition(condition.id)}
                  className="shrink-0 px-1.5 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                  title="Remove condition"
                >
                  ×
                </button>
              </div>

              <div className="flex items-center justify-between min-w-0">
                <div className="text-xs text-purple-700 font-mono truncate flex-1 min-w-0">
                  {generateConditionString(condition)}
                </div>
                {getConditionEdge(condition.id) && (
                  <div className="flex items-center gap-1 shrink-0 ml-1">
                    <span className="text-xs text-gray-600 whitespace-nowrap">→ {getConditionTarget(condition.id)}</span>
                    <button
                      onClick={() => handleDeleteEdge(condition.id)}
                      className="p-0.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors shrink-0"
                      title="Delete connection"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addCondition}
          className="mt-2 w-full px-2 py-1.5 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
        >
          + Add Condition
        </button>

        {nodeData.conditions.length === 0 && (
          <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 text-center">
            <p className="text-xs text-gray-500">No conditions defined</p>
          </div>
        )}

        <div className="mt-2 p-1.5 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-600">
            <strong>Tip:</strong> Each condition creates a unique connection point.
          </p>
        </div>
      </div>
      {nodeData.conditions.map((condition, index) => (
        <Handle
          key={condition.id}
          type="source"
          position={Position.Bottom}
          id={condition.id}
          className="w-2! h-2! bg-transparent! border-none! cursor-crosshair"
          style={{
            left: `${20 + index * 20}%`
          }}
        />
      ))}
    </div>
  );
});

BranchNodeComponent.displayName = 'BranchNodeComponent';

export default BranchNodeComponent;