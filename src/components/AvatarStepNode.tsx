import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { useWorkflowStore } from '../store/workflowStore';
import { mockVideoLibrary } from '../data/videoLibrary';
import type { WorkflowNode } from '../types/workflow';

const AvatarStepNode = memo(({ id, data }: NodeProps) => {
  const { updateNodeData } = useWorkflowStore();

  const nodeData = data as WorkflowNode;
  const selectedCategory = mockVideoLibrary.find(cat => cat.id === nodeData.category);  

  const handleCategoryChange = (categoryId: string) => {
    updateNodeData(id, {
      category: categoryId,
      videoId: '' // Reset video when category changes
    });
  };

  const handleVideoChange = (videoId: string) => {
    updateNodeData(id, { videoId });
  };

  const handleQuestionChange = (questionText: string) => {
    updateNodeData(id, { questionText });
  };

  const handleInputTypeChange = (inputType: 'choice' | 'number' | 'text' | 'none') => {
    updateNodeData(id, { inputType });
  };

  const handleMandatoryChange = (isMandatory: boolean) => {
    updateNodeData(id, { isMandatory });
  };

  const handleVariableNameChange = (variableName: string) => {
    updateNodeData(id, { variableName });
  };

  return (
    <div className="bg-white border-2 border-blue-300 rounded-lg shadow-lg min-w-80 p-4">
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-transparent !border-none cursor-crosshair"
      />

      <div className="mb-4">
        <h3 className="font-semibold text-gray-800 mb-3">Avatar Step</h3>

        {/* Video Category Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video Category
          </label>
          <select
            value={nodeData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="">Select category...</option>
            {mockVideoLibrary.map(category => (
              <option key={category.id} value={category.id} className="text-black">
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Video Selection */}
        {selectedCategory && (
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specific Video
            </label>
            <select
              value={nodeData.videoId}
              onChange={(e) => handleVideoChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select video...</option>
              {selectedCategory.videos.map(video => (
                <option key={video.id} value={video.id}>
                  {video.title} ({video.duration})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Question Text */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <input
            type="text"
            value={nodeData.questionText}
            onChange={(e) => handleQuestionChange(e.target.value)}
            placeholder="What question is the avatar asking?"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Input Type */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Input Type
          </label>
          <select
            value={nodeData.inputType}
            onChange={(e) => handleInputTypeChange(e.target.value as 'choice' | 'number' | 'text' | 'none')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="choice">Multiple Choice</option>
            <option value="number">Number</option>
            <option value="text">Text</option>
            <option value="none">No Input</option>
          </select>
        </div>

        {/* Variable Name */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variable Name (optional)
          </label>
          <input
            type="text"
            value={nodeData.variableName || ''}
            onChange={(e) => handleVariableNameChange(e.target.value)}
            placeholder="e.g., weight, bmi, pain_level"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Mandatory Checkbox */}
        <div className="mb-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={nodeData.isMandatory}
              onChange={(e) => handleMandatoryChange(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Mandatory Step</span>
          </label>
        </div>



        {/* Error State */}
        {!nodeData.videoId && nodeData.category && (
          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-sm text-red-600">⚠️ Please select a video</p>
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

AvatarStepNode.displayName = 'AvatarStepNode';

export default AvatarStepNode;