import React from 'react'
import { Activity } from 'lucide-react'

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero skeleton */}
      <div className="rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-2 flex-1">
            <div className="w-48 h-5 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-96 max-w-full h-3.5 rounded-md bg-slate-100 dark:bg-slate-800/60" />
          </div>
        </div>
      </div>

      {/* Metrics skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="w-24 h-3 rounded-md bg-slate-200 dark:bg-slate-800" />
            <div className="w-16 h-8 rounded-md bg-slate-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>

      {/* Main chart skeleton */}
      <div className="h-96 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Activity className="w-8 h-8 text-cyan-600/50 dark:text-cyan-500/50 animate-spin" />
        <span className="text-xs font-mono">Fetching repository telemetry from GitHub API...</span>
      </div>
    </div>
  )
}
