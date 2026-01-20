import { memo, useState, useMemo } from 'react';
import { getSmoothStepPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { useWorkflowStore } from '../store/workflowStore';
import type { BranchNode } from '../types/workflow';

const CustomEdge = memo(({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	source,
	style = {},
	markerEnd,
}: EdgeProps) => {
	const { deleteEdge, nodes, edges } = useWorkflowStore();
	const [isHovered, setIsHovered] = useState(false);

	const [edgePath, labelX, labelY] = getSmoothStepPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
		borderRadius: 20,
	});

	const conditionLabel = useMemo(() => {
		if (!source) return null;

		const edge = edges.find(e => e.id === id);
		if (!edge || !edge.sourceHandle) return null;

		const sourceNode = nodes.find(node => node.id === source);
		if (!sourceNode || sourceNode.type !== 'branch') return null;

		const nodeData = sourceNode.data as BranchNode;
		const condition = nodeData.conditions.find(c => c.id === edge.sourceHandle);

		if (!condition) return null;

		if (!condition.variable || !condition.value) return 'Incomplete condition';
		return `${condition.variable} ${condition.operator} ${condition.value}`;
	}, [id, source, nodes, edges]);

	const handleDelete = (e: React.MouseEvent) => {
		e.stopPropagation();
		deleteEdge(id);
	};

	return (
		<>
			<path
				id={id}
				style={style}
				className="react-flow__edge-path"
				d={edgePath}
				markerEnd={markerEnd}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			/>
			{conditionLabel && (
				<g>
					<rect
						x={labelX - 60}
						y={labelY - 10}
						width={120}
						height={20}
						rx={4}
						fill="white"
						stroke="#9333ea"
						strokeWidth={1}
						className="pointer-events-none"
					/>
					<text
						x={labelX}
						y={labelY}
						textAnchor="middle"
						dominantBaseline="middle"
						className="pointer-events-none select-none text-xs fill-purple-700 font-medium"
					>
						{conditionLabel}
					</text>
				</g>
			)}
			{isHovered && (
				<g>
					<circle
						cx={labelX}
						cy={conditionLabel ? labelY - 25 : labelY}
						r={12}
						fill="white"
						stroke="red"
						strokeWidth={5}
						className="cursor-pointer"
						onClick={handleDelete}
					/>
					<text
						x={labelX}
						y={conditionLabel ? labelY - 25 : labelY}
						textAnchor="middle"
						dominantBaseline="middle"
						className="pointer-events-none select-none text-xs fill-red-600 font-bold"
					>
						×
					</text>
				</g>
			)}
		</>
	);
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;

