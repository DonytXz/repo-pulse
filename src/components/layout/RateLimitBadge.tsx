import React from 'react'
import { useRateLimit } from '../../hooks/useRateLimit'
import { ShieldAlert, Zap, Key } from 'lucide-react'

interface RateLimitBadgeProps {
  onOpenTokenModal: () => void
}

export const RateLimitBadge: React.FC<RateLimitBadgeProps> = ({ onOpenTokenModal }) => {
  const status = useRateLimit()

  const percent = status.limit > 0 ? Math.round((status.remaining / status.limit) * 100) : 0
  const isExhausted = status.remaining === 0
  const isLow = status.remaining <= 10

  const resetMinutes = Math.max(0, Math.round((status.reset * 1000 - status.lastUpdated) / 60000))

  return (
    <button
      onClick={onOpenTokenModal}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        isExhausted
          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
          : isLow
          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
      }`}
      title={`GitHub API Rate Limit: ${status.remaining}/${status.limit} remaining. Resets in ${resetMinutes} mins. Click to configure PAT.`}
      aria-label="GitHub API Rate Limit Status"
    >
      {isExhausted ? (
        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 animate-pulse" />
      ) : isLow ? (
        <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
      ) : (
        <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
      )}
      <span>
        API Quota: <strong className="font-semibold">{status.remaining}</strong>/{status.limit}
      </span>
      <span className="hidden sm:inline text-slate-500 dark:text-slate-400 font-normal">({percent}%)</span>
      <Key className="w-3 h-3 text-slate-500 dark:text-slate-400 ml-0.5" />
    </button>
  )
}
