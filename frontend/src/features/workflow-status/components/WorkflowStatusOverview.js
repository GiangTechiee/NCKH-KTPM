import React from 'react';

function WorkflowStatusOverview({ message, health, isLoading, errorMessage }) {
  return (
    <div className="grid gap-6 px-8 py-8 md:grid-cols-2">
      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <p className="text-sm font-medium text-slate-400">Backend message</p>
        {errorMessage ? (
          <p className="mt-3 text-sm font-medium text-rose-300">{errorMessage}</p>
        ) : (
          <p className="mt-3 text-lg font-semibold text-white">
            {isLoading ? 'Dang tai du lieu...' : message}
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
        <p className="text-sm font-medium text-slate-400">Health check</p>
        {health ? (
          <div className="mt-3 space-y-2 text-sm text-slate-200">
            <p>
              <span className="text-slate-400">Trang thai:</span>{' '}
              <span className="font-semibold text-emerald-400">{health.status}</span>
            </p>
            <p>
              <span className="text-slate-400">Thoi gian:</span>{' '}
              <span>{new Date(health.timestamp).toLocaleString('vi-VN')}</span>
            </p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-300">
            {isLoading ? 'Dang kiem tra backend...' : 'Chua co du lieu health check.'}
          </p>
        )}
      </section>
    </div>
  );
}

export default WorkflowStatusOverview;
