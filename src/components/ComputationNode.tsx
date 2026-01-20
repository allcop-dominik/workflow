import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useWorkflowStore } from '../store/workflowStore';
import type { ComputationNode } from '../types/workflow';

const ComputationNodeComponent = memo(({ id, data }: NodeProps) => {
	const { updateNodeData } = useWorkflowStore();

	const nodeData = data as ComputationNode;

	const handleLabelChange = (label: string) => {
		updateNodeData(id, { label });
	};

	const handleFormulaChange = (formula: string) => {
		updateNodeData(id, { formula });
	};

	const handleOutputVariableChange = (outputVariable: string) => {
		updateNodeData(id, { outputVariable });
	};

	return (
		<div className="bg-white border-2 border-orange-300 rounded-lg shadow-lg min-w-96 p-4">
			<Handle
				type="target"
				position={Position.Top}
				className="!w-2 !h-2 !bg-transparent !border-none cursor-crosshair"
			/>

			<div className="mb-4">
				<h3 className="font-semibold text-gray-800 mb-3">Computation Node</h3>

				<div className="mb-3">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Label
					</label>
					<input
						type="text"
						value={nodeData.label}
						onChange={(e) => handleLabelChange(e.target.value)}
						placeholder="e.g., Calculate BMI"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
					/>
				</div>

				<div className="mb-3">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Formula / Expression
					</label>
					<input
						type="text"
						value={nodeData.formula}
						onChange={(e) => handleFormulaChange(e.target.value)}
						placeholder="e.g., weight / (height * height)"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-sm"
					/>
					<p className="text-xs text-gray-500 mt-1">
						Use variable names from previous nodes (e.g., weight, height)
					</p>
				</div>

				<div className="mb-3">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Output Variable Name
					</label>
					<input
						type="text"
						value={nodeData.outputVariable}
						onChange={(e) => handleOutputVariableChange(e.target.value)}
						placeholder="e.g., bmi"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
					/>
					<p className="text-xs text-gray-500 mt-1">
						This variable can be used in branch nodes for conditions
					</p>
				</div>

				{nodeData.formula && nodeData.outputVariable && (
					<div className="mt-3 p-2 bg-orange-50 rounded border border-orange-200">
						<p className="text-sm font-medium text-orange-800">Computation Preview:</p>
						<p className="text-sm text-orange-600 font-mono">
							{nodeData.outputVariable} = {nodeData.formula}
						</p>
					</div>
				)}

				{(!nodeData.formula || !nodeData.outputVariable) && (
					<div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
						<p className="text-sm text-yellow-600">
							⚠️ Please provide both formula and output variable name
						</p>
					</div>
				)}
			</div>

			<Handle
				type="source"
				position={Position.Bottom}
				className="!w-2 !h-2 !bg-transparent !border-none cursor-crosshair"
			/>
		</div>
	);
});

ComputationNodeComponent.displayName = 'ComputationNodeComponent';

export default ComputationNodeComponent;

