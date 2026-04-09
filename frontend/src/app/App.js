import React from 'react';
import { WorkflowStatusPage } from '../features/workflow-status';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl items-center justify-center">
        <WorkflowStatusPage />
      </div>
    </div>
  );
}

export default App;
