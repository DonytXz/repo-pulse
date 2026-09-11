import React from 'react'
import { AlertCircle, Key, Sparkles, RefreshCw } from 'lucide-react'
import { GitHubApiError } from '../../api/client'

interface ErrorDisplayProps {
  error: Error | GitHubApiError
  onRetry: () => void
  onSwitchToDemo: () => void
  onOpenTokenModal: () => void
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onSwitchToDemo,
  onOpenTokenModal,
}) => {
  const isRateLimit = (error as GitHubApiError).isRateLimit

  return (
    <div
      role="alert"
      className="max-w-2xl mx-auto my-12 p-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-4"
    >
      <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 dark:text-rose-400">
        <AlertCircle className="w-6 h-6" aria-hidden="true" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">
          {isRateLimit ? 'GitHub API Rate Limit Reached' : 'Unable to Load Repository Telemetry'}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {error.message || 'An unexpected error occurred while communicating with the GitHub API.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onSwitchToDemo}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-500 dark:hover:bg-purple-400 text-white dark:text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400"
        >
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          <span>Explore Demo Snapshot (Zero API Calls)</span>
        </button>

        <button
          type="button"
          onClick={onOpenTokenModal}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium text-xs transition-colors flex items-center gap-2 border border-slate-300 dark:border-slate-700 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-500"
        >
          <Key className="w-4 h-4 text-cyan-600 dark:text-cyan-400" aria-hidden="true" />
          <span>Add Free GitHub Token (5,000 reqs/hr)</span>
        </button>

        <button
          type="button"
          onClick={onRetry}
          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-800 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  )
}
