import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const StartNode = memo(() => {
  return (
    <div className="bg-green-500 text-white rounded-full shadow-lg min-w-32 min-h-32 flex items-center justify-center">
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-transparent !border-none cursor-crosshair"
      />
      <div className="text-center">
        <div className="text-lg font-bold">START</div>
        <div className="text-xs opacity-90">Begin Workflow</div>
      </div>
    </div>
  );
});

StartNode.displayName = 'StartNode';

export default StartNode;