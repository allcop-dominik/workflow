import { ReactFlowProvider } from '@xyflow/react'
import WorkflowEditor from './components/WorkflowEditor'

function App() {
  return (
    <ReactFlowProvider>
      <WorkflowEditor />
    </ReactFlowProvider>
  )
}

export default App
