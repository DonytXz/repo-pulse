import React from 'react'
import type { RepositoryInfo } from '../../api/types'
import {
  Star,
  GitFork,
  Eye,
  ExternalLink,
  Tag,
  LayoutGrid,
  GitGraph,
  TrendingUp,
  FileCheck2,
  Users,
} from 'lucide-react'

interface RepoHeroProps {
  repository: RepositoryInfo
  activeTab: 'overview' | 'network' | 'velocity' | 'burndown' | 'contributors'
  onSelectTab: (tab: 'overview' | 'network' | 'velocity' | 'burndown' | 'contributors') => void
  isDemo?: boolean
}

export const RepoHero: React.FC<RepoHeroProps> = ({
  repository,
  activeTab,
  onSelectTab,
  isDemo,
}) => {
  const tabs = [
    { id: 'overview' as const, label: 'Overview & Heatmap', icon: LayoutGrid },
    { id: 'network' as const, label: 'Contributor Network', icon: GitGraph },
    { id: 'velocity' as const, label: 'PR Velocity', icon: TrendingUp },
    { id: 'burndown' as const, label: 'Issue Burndown', icon: FileCheck2 },
    { id: 'contributors' as const, label: 'Contributors', icon: Users },
  ]

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Avatar, Repo Name, Description */}
        <div className="flex items-start gap-4">
          <img
            src={repository.owner.avatar_url}
            alt={repository.owner.login}
            className="w-14 h-14 rounded-2xl border border-slate-700 bg-slate-950 p-1 shrink-0"
          />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-2">
                <span>{repository.full_name}</span>
              </h1>
              {isDemo && (
                <span className="px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Demo Snapshot
                </span>
              )}
              {repository.license && (
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {repository.license.spdx_id || repository.license.name}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              {repository.description || 'No description provided for this repository.'}
            </p>

            {/* Topics */}
            {repository.topics && repository.topics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {repository.topics.slice(0, 6).map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {topic}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Repo Metrics & Link */}
        <div className="flex flex-wrap items-center gap-2.5 lg:self-start">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
            <Star className="w-4 h-4 text-amber-400" />
            <span className="font-mono font-semibold text-white">
              {repository.stargazers_count.toLocaleString()}
            </span>
            <span className="text-slate-500">stars</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
            <GitFork className="w-4 h-4 text-blue-400" />
            <span className="font-mono font-semibold text-white">
              {repository.forks_count.toLocaleString()}
            </span>
            <span className="text-slate-500">forks</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="font-mono font-semibold text-white">
              {repository.subscribers_count.toLocaleString()}
            </span>
            <span className="text-slate-500">watchers</span>
          </div>

          <a
            href={`https://github.com/${repository.full_name}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-950/80 border border-slate-800 hover:bg-slate-800 transition-colors"
            title="Open on GitHub"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
