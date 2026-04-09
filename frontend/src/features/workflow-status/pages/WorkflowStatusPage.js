import React from 'react';
import WorkflowStatusOverview from '../components/WorkflowStatusOverview';
import { useWorkflowStatus } from '../hooks/useWorkflowStatus';

function WorkflowStatusPage() {
  const { message, health, isLoading, errorMessage } = useWorkflowStatus();

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-cyan-950/20 backdrop-blur">
      <div className="border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-indigo-500/10 px-8 py-8">
        <p className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
          NCKH-KTPM
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Khung frontend da san sang voi Tailwind CSS 3
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
          Luong hien tai duoc tach ro thanh App, Page, Hook, Service va API client de de truy vet khi ve sequence diagram.
        </p>
      </div>

      <WorkflowStatusOverview
        message={message}
        health={health}
        isLoading={isLoading}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default WorkflowStatusPage;
