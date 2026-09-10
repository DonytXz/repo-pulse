import React from 'react'
import type { RepoMetrics } from '../../api/types'
import { Shield, Users, Clock, CheckCircle2, Star, GitFork, AlertTriangle } from 'lucide-react'

interface MetricCardsProps {
  metrics: RepoMetrics
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const { summary, repository } = metrics

  const healthBadge =
    summary.healthScore >= 80
      ? { label: 'High Velocity & Resilient', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
      : summary.healthScore >= 60
      ? { label: 'Active & Stable', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' }
      : { label: 'Attention Recommended', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }

  const busFactorRisk =
    summary.busFactor <= 2
      ? { label: 'High Risk', color: 'text-rose-400' }
      : summary.busFactor <= 4
      ? { label: 'Moderate', color: 'text-amber-400' }
      : { label: 'Low Risk', color: 'text-emerald-400' }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Health Score */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Ecosystem Health</span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Shield className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {summary.healthScore}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.healthScore}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${healthBadge.color}`}>
            {healthBadge.label}
          </span>
        </div>
      </div>

      {/* 2. Bus Factor */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Bus Factor Resilience</span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {summary.busFactor}
            </span>
            <span className="text-xs text-slate-400">maintainers (50% code)</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Risk Assessment: <strong className={busFactorRisk.color}>{busFactorRisk.label}</strong>
          </p>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <AlertTriangle className="w-3 h-3" />
          <span>Calculated across active authors</span>
        </div>
      </div>

      {/* 3. PR Turnaround / Merge Time */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">PR Velocity Turnaround</span>
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {summary.avgMergeTimeHours > 48
                ? `${Math.round((summary.avgMergeTimeHours / 24) * 10) / 10}d`
                : `${summary.avgMergeTimeHours}h`}
            </span>
            <span className="text-xs text-slate-400">avg to merge</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Merge Success Rate: <strong className="text-white font-mono">{summary.prMergeRate}%</strong>
          </p>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{metrics.pullRequests.length} recent pull requests</span>
        </div>
      </div>

      {/* 4. Issue Resolution Rate & Activity */}
      <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">Issue Resolution Cadence</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-white font-mono">
              {summary.issueResolutionRate}%
            </span>
            <span className="text-xs text-slate-400">resolved tickets</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400" />
              {(repository.stargazers_count / 1000).toFixed(1)}k
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="w-3 h-3 text-blue-400" />
              {(repository.forks_count / 1000).toFixed(1)}k
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>{repository.open_issues_count.toLocaleString()} open backlog items</span>
        </div>
      </div>
    </div>
  )
}
