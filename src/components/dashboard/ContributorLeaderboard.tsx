import React from 'react'
import type { Contributor } from '../../api/types'
import { ExternalLink, Award } from 'lucide-react'

interface ContributorLeaderboardProps {
  contributors: Contributor[]
  highlightedUser?: string
  onSelectUser: (login: string) => void
}

export const ContributorLeaderboard: React.FC<ContributorLeaderboardProps> = ({
  contributors,
  highlightedUser,
  onSelectUser,
}) => {
  const topList = contributors.slice(0, 15)
  const maxContributions = topList[0]?.contributions || 1
  const totalContributions = contributors.reduce((acc, c) => acc + c.contributions, 0) || 1

  return (
    <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Top Core Contributors
          </h3>
          <p className="text-xs text-slate-400">
            Ranked by total direct repository commits & merged contributions
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400 tabular-nums">
          {contributors.length} total
        </span>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[460px] pr-1">
        {topList.map((contributor, index) => {
          const isSelected = highlightedUser === contributor.login
          const percentOfTotal = Math.round((contributor.contributions / totalContributions) * 100)
          const barWidth = Math.round((contributor.contributions / maxContributions) * 100)

          return (
            <div
              key={contributor.id}
              className={`w-full p-2.5 rounded-xl border transition-colors flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-xs shadow-cyan-500/20'
                  : 'bg-slate-950/50 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectUser(contributor.login)}
                aria-pressed={isSelected}
                aria-label={`Select contributor ${contributor.login}, ${contributor.contributions} contributions, rank #${index + 1}`}
                className="flex-1 min-w-0 text-left flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-0.5 -m-0.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono tabular-nums font-medium text-slate-400 w-5 text-right">
                    #{index + 1}
                  </span>
                  <img
                    src={contributor.avatar_url}
                    alt=""
                    width={28}
                    height={28}
                    loading="lazy"
                    className="w-7 h-7 rounded-full border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate flex items-center gap-1.5">
                      <span>{contributor.login}</span>
                      {index === 0 && (
                        <span className="text-[10px] px-1 py-0.2 rounded-sm bg-amber-500/20 text-amber-300 font-normal">
                          Lead
                        </span>
                      )}
                    </div>
                    <div className="w-24 bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-mono tabular-nums font-semibold text-white">
                    {contributor.contributions.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 tabular-nums">
                    {percentOfTotal}% share
                  </div>
                </div>
              </button>

              <a
                href={contributor.html_url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-cyan-400 shrink-0"
                title="View GitHub profile"
                aria-label={`View ${contributor.login}'s profile on GitHub`}
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
