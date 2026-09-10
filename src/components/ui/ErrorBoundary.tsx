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
    <div className="max-w-2xl mx-auto my-12 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl text-center space-y-4">
      <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white">
          {isRateLimit ? 'GitHub API Rate Limit Reached' : 'Unable to Load Repository Telemetry'}
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          {error.message || 'An unexpected error occurred while communicating with the GitHub API.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onSwitchToDemo}
          className="px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Explore Demo Snapshot (Zero API Calls)</span>
        </button>

        <button
          onClick={onOpenTokenModal}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
        >
          <Key className="w-4 h-4 text-cyan-400" />
          <span>Add Free GitHub Token (5,000 reqs/hr)</span>
        </button>

        <button
          onClick={onRetry}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs transition-all flex items-center gap-2 border border-slate-800 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    </div>
  )
}
