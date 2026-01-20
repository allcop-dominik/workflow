import { memo } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

const ExportButton = memo(() => {
  const { exportWorkflow, validateWorkflow, guardrailViolations } = useWorkflowStore();

  const handleExport = () => {
    // Validate before export
    const violations = validateWorkflow();
    
    if (violations.length > 0) {
      alert(`Cannot export workflow. Please fix the following issues:\n\n${violations.join('\n')}`);
      return;
    }

    // Export workflow
    const workflowData = exportWorkflow();
    
    // Copy to clipboard
    navigator.clipboard.writeText(JSON.stringify(workflowData, null, 2))
      .then(() => {
        alert('Workflow exported successfully and copied to clipboard!\n\nCheck console for full JSON structure.');
        console.log('Exported Workflow:', workflowData);
      })
      .catch(() => {
        // Fallback: download as file
        const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
          type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'medical-workflow.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Exported Workflow:', workflowData);
      });
  };

  const handlePreview = () => {
    const violations = validateWorkflow();
    
    if (violations.length > 0) {
      alert('Please fix all violations before previewing the export.');
      return;
    }

    const workflowData = exportWorkflow();
    console.log('Workflow Preview:', workflowData);
    
    // Also show in a modal or alert for quick viewing
    alert('Export preview logged to console. Press F12 to view.');
  };

  return (
    <div className="fixed bottom-4 left-4 flex gap-2 z-10">
      <button
        onClick={handlePreview}
        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm shadow-lg"
      >
        Preview Export
      </button>
      
      <button
        onClick={handleExport}
        disabled={guardrailViolations.length > 0}
        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 text-sm shadow-lg ${
          guardrailViolations.length > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500'
        }`}
      >
        {guardrailViolations.length > 0 ? 'Fix Issues First' : 'Export JSON'}
      </button>
    </div>
  );
});

ExportButton.displayName = 'ExportButton';

export default ExportButton;