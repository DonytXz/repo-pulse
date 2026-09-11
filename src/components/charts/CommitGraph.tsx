import React, { useState, useMemo, useRef } from 'react'
import { Search, GitBranch, Tag, Copy, Check, Filter } from 'lucide-react'
import type { CommitItem, BranchInfo } from '../../api/types'
import { computeGitGraph, generateRoutePath, DEFAULT_LAYOUT } from '../../utils/gitGraph'
import { useTheme } from '../../context/ThemeContext'

interface CommitGraphProps {
  commits: CommitItem[]
  branches?: BranchInfo[]
  selectedSha?: string
  onSelectCommit: (sha: string) => void
}

export const CommitGraph: React.FC<CommitGraphProps> = ({
  commits,
  branches = [],
  selectedSha,
  onSelectCommit,
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedSha, setCopiedSha] = useState<string | null>(null)
  const listContainerRef = useRef<HTMLDivElement>(null)

  // 1. Compute DAG layout
  const graphCommits = useMemo(() => {
    return computeGitGraph(commits, branches)
  }, [commits, branches])

  // 2. Filter commits
  const filteredCommits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return graphCommits
    return graphCommits.filter(
      (c) =>
        c.commit.message.toLowerCase().includes(q) ||
        c.sha.toLowerCase().includes(q) ||
        (c.author?.login && c.author.login.toLowerCase().includes(q)) ||
        c.commit.author.name.toLowerCase().includes(q)
    )
  }, [graphCommits, searchQuery])

  // 3. Compute SVG dimensions
  const maxTrack = useMemo(() => {
    return graphCommits.reduce((max, c) => Math.max(max, c.trackIndex), 0)
  }, [graphCommits])

  const laneWidth = DEFAULT_LAYOUT.laneWidth
  const rowHeight = DEFAULT_LAYOUT.rowHeight
  const nodeRadius = DEFAULT_LAYOUT.nodeRadius
  const originX = 18
  const svgWidth = Math.max(70, (maxTrack + 1) * laneWidth + originX + 16)

  const handleCopySha = (e: React.MouseEvent, sha: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(sha)
    setCopiedSha(sha)
    setTimeout(() => setCopiedSha(null), 1800)
  }

  // Keyboard navigation through commit rows
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const nextBtn = listContainerRef.current?.querySelector<HTMLButtonElement>(`button[data-row-index="${index + 1}"]`)
      nextBtn?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prevBtn = listContainerRef.current?.querySelector<HTMLButtonElement>(`button[data-row-index="${index - 1}"]`)
      prevBtn?.focus()
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (filteredCommits[index]) {
        onSelectCommit(filteredCommits[index].sha)
      }
    }
  }

  return (
    <div
      role="region"
      aria-label="Git commit history graph and topological subway tree"
      className="w-full rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden shadow-xl"
    >
      {/* Top Controls Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 shrink-0">
            <GitBranch className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Commit History Graph</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-normal">
                ({filteredCommits.length} of {commits.length} commits)
              </span>
            </h3>
          </div>
        </div>

        {/* Search input */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter commits by message, author, SHA..."
            aria-label="Filter commits"
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Commit Graph List */}
      <div
        ref={listContainerRef}
        role="region"
        aria-label="Git Commit History"
        tabIndex={0}
        className="w-full overflow-x-auto max-h-[640px] overflow-y-auto select-none font-sans focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-cyan-500/50"
      >
        {filteredCommits.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-xs">
            <Filter className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" aria-hidden="true" />
            <p className="font-medium text-slate-700 dark:text-slate-300">No commits match your filter query</p>
            <p className="text-[11px] text-slate-500 mt-1">Try clearing the search input above</p>
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-200 dark:divide-slate-800/60 min-w-full">
            {filteredCommits.map((commit, index) => {
              const isSelected = selectedSha === commit.sha
              const shortSha = commit.sha.slice(0, 7)
              const nodeX = originX + commit.trackIndex * laneWidth
              const nodeY = rowHeight / 2
              const messageLines = commit.commit.message.split('\n')
              const title = messageLines[0]
              const formattedDate = new Date(commit.commit.author.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })

              return (
                <li
                  key={commit.sha}
                  className={`w-full flex items-center transition-colors group ${
                    isSelected
                      ? 'bg-cyan-500/15 text-slate-900 dark:text-white'
                      : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={{ height: `${rowHeight}px` }}
                >
                  {/* Clickable Commit Row */}
                  <button
                    type="button"
                    data-row-index={index}
                    onClick={() => onSelectCommit(commit.sha)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    aria-pressed={isSelected}
                    aria-label={`Commit ${shortSha}: ${title} by ${commit.author?.login || commit.commit.author.name}`}
                    className="flex-1 min-w-0 h-full flex items-center text-left cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-500"
                  >
                    {/* 1. SVG Subway Rails & Node */}
                    <div
                      className="shrink-0 h-full relative"
                      style={{ width: `${svgWidth}px` }}
                    >
                      <svg
                        width={svgWidth}
                        height={rowHeight}
                        className="absolute inset-0 pointer-events-none"
                        aria-hidden="true"
                      >
                        {/* Routes to parents */}
                        {commit.routes.map((route, rIdx) => {
                          const pathStr = generateRoutePath(
                            route.fromTrack,
                            route.toTrack,
                            nodeY,
                            rowHeight,
                            laneWidth,
                            originX
                          )
                          return (
                            <path
                              key={rIdx}
                              d={pathStr}
                              fill="none"
                              stroke={commit.color}
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              opacity={isDark ? "0.85" : "0.95"}
                            />
                          )
                        })}

                        {/* Commit Node Circle */}
                        <circle
                          cx={nodeX}
                          cy={nodeY}
                          r={isSelected ? nodeRadius + 1.5 : nodeRadius}
                          fill={commit.color}
                          stroke={isDark ? "#0f172a" : "#ffffff"}
                          strokeWidth="2"
                        />

                        {/* Merge Commit Hollow Indicator */}
                        {commit.parents && commit.parents.length > 1 && (
                          <circle
                            cx={nodeX}
                            cy={nodeY}
                            r={nodeRadius - 2}
                            fill={isDark ? "#020617" : "#ffffff"}
                          />
                        )}
                      </svg>
                    </div>

                    {/* 2. Badges & Commit Summary */}
                    <div className="flex-1 min-w-0 pr-4 flex items-center gap-2">
                      {/* Branch and Tag Badges */}
                      {commit.badges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium flex items-center gap-1 shrink-0 ${
                            badge.type === 'head'
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40'
                              : badge.type === 'branch'
                              ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40'
                              : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {badge.type === 'tag' ? (
                            <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                          ) : (
                            <GitBranch className="w-2.5 h-2.5" aria-hidden="true" />
                          )}
                          <span>{badge.name}</span>
                        </span>
                      ))}

                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-white">
                        {title}
                      </span>
                    </div>

                    {/* 3. Author Info */}
                    <div className="hidden sm:flex items-center gap-2 w-44 shrink-0 pr-3">
                      {commit.author?.avatar_url ? (
                        <img
                          src={commit.author.avatar_url}
                          alt=""
                          width={20}
                          height={20}
                          loading="lazy"
                          className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-mono text-[10px] text-slate-600 dark:text-slate-400">
                          {commit.commit.author.name[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs text-slate-600 dark:text-slate-300 truncate">
                        {commit.author?.login || commit.commit.author.name}
                      </span>
                    </div>

                    {/* 4. Date */}
                    <div className="hidden md:block w-28 shrink-0 text-right pr-4 text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                      {formattedDate}
                    </div>
                  </button>

                  {/* 5. Short SHA Copy Button */}
                  <div className="shrink-0 pr-4">
                    <button
                      type="button"
                      onClick={(e) => handleCopySha(e, commit.sha)}
                      aria-label={`Copy SHA ${shortSha}`}
                      title="Copy full commit SHA"
                      className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-950/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 font-mono text-[11px] text-cyan-700 dark:text-cyan-400 flex items-center gap-1 transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-cyan-500 cursor-pointer"
                    >
                      <span>{shortSha}</span>
                      {copiedSha === commit.sha ? (
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                      ) : (
                        <Copy className="w-3 h-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Footer info tip */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <span>Tip: Click any commit to view changed files & line diffs &bull; ArrowUp/Down to navigate</span>
        <span>Git DAG Subway Map</span>
      </div>
    </div>
  )
}
