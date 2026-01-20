import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const EndNode = memo(() => {
  return (
    <div className="bg-red-500 text-white rounded-full shadow-lg min-w-32 min-h-32 flex items-center justify-center">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-transparent !border-none cursor-crosshair"
      />
      <div className="text-center">
        <div className="text-lg font-bold">END</div>
        <div className="text-xs opacity-90">Complete</div>
      </div>
    </div>
  );
});

EndNode.displayName = 'EndNode';

export default EndNode;