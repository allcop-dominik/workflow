import { memo } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

const GuardrailSidebar = memo(() => {
  const { guardrailViolations, validateWorkflow } = useWorkflowStore();

  const handleValidate = () => {
    validateWorkflow();
  };

  const getViolationIcon = (violation: string) => {
    if (violation.includes('video')) return '🎬';
    if (violation.includes('variable')) return '📊';
    if (violation.includes('connection')) return '🔗';
    if (violation.includes('End node')) return '🏁';
    return '⚠️';
  };

  const getViolationSeverity = (violation: string) => {
    if (violation.includes('video')) return 'high';
    if (violation.includes('variable')) return 'medium';
    if (violation.includes('End node')) return 'high';
    return 'low';
  };

  if (guardrailViolations.length === 0) {
    return null; // Only show when there are violations
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 p-4 overflow-y-auto z-10">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Clinical Safety Violations</h2>
        <p className="text-sm text-gray-600 mb-4">
          The following issues must be resolved before exporting:
        </p>
        
        <button
          onClick={handleValidate}
          className="w-full mb-4 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          Revalidate Workflow
        </button>
      </div>

      <div className="space-y-3">
        {guardrailViolations.map((violation, index) => {
          const severity = getViolationSeverity(violation);
          const severityColors = {
            high: 'bg-red-50 border-red-200 text-red-700',
            medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
            low: 'bg-blue-50 border-blue-200 text-blue-700',
          };

          return (
            <div
              key={index}
              className={`p-3 rounded-lg border ${severityColors[severity]}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{getViolationIcon(violation)}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{violation}</p>
                  {severity === 'high' && (
                    <p className="text-xs mt-1 opacity-75">
                      This is a critical safety issue that must be fixed.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2 text-sm">Guardrail Checks:</h3>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• All avatar steps have associated videos</li>
          <li>• All branch nodes use defined variables</li>
          <li>• No orphaned nodes (except Start)</li>
          <li>• Workflow has at least one End node</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
        <h3 className="font-medium text-green-800 mb-1 text-sm">Clinical Safety</h3>
        <p className="text-xs text-green-700">
          These checks ensure medical workflows are complete and safe for patient use.
        </p>
      </div>
    </div>
  );
});

GuardrailSidebar.displayName = 'GuardrailSidebar';

export default GuardrailSidebar;