import React, { useState } from 'react'
import { Activity, Search, Sparkles, Command } from 'lucide-react'
import { RateLimitBadge } from './RateLimitBadge'
import { normalizeRepoInput } from '../../utils/repoParser'

interface HeaderProps {
  currentRepo: string
  isDemo: boolean
  onSelectRepo: (repo: string, isDemo?: boolean) => void
  onToggleDemo: () => void
  onOpenTokenModal: () => void
  onOpenCommandPalette: () => void
}

export const Header: React.FC<HeaderProps> = ({
  currentRepo,
  isDemo,
  onSelectRepo,
  onToggleDemo,
  onOpenTokenModal,
  onOpenCommandPalette,
}) => {
  const [searchInput, setSearchInput] = useState(currentRepo)

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      const normalized = normalizeRepoInput(searchInput.trim())
      onSelectRepo(normalized, false)
      setSearchInput(normalized)
    }
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Brand & quick repo pill */}
        <div className="flex items-center justify-between md:justify-start gap-4">
          <button
            type="button"
            onClick={() => onSelectRepo('facebook/react', false)}
            aria-label="RepoPulse Home - Reset to default repository"
            className="flex items-center gap-2.5 cursor-pointer group select-none text-left rounded-xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 p-1 -m-1"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white font-sans">
                  RepoPulse
                </span>
                <span className="px-1.5 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  OSS Intel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Open-Source Ecosystem Telemetry
              </p>
            </div>
          </button>

          {/* Demo toggle badge */}
          <button
            type="button"
            onClick={onToggleDemo}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 ${
              isDemo
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-xs shadow-purple-500/20'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Toggle offline demo dataset (zero API calls)"
            aria-pressed={isDemo}
            aria-label={isDemo ? 'Disable demo mode' : 'Enable offline demo mode'}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{isDemo ? 'Demo Mode: ON' : 'Live Mode'}</span>
          </button>
        </div>

        {/* Center: Search input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md" role="search">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" aria-hidden="true" />
            <input
              id="repo-search-input"
              name="repoQuery"
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search repo or paste URL (e.g. https://github.com/...)..."
              aria-label="Search repository name or paste GitHub URL"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              className="w-full pl-10 pr-20 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-colors"
            />
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700 flex items-center gap-1 hover:text-slate-200 cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-cyan-400"
              title="Open Command Palette (Cmd+K)"
              aria-label="Open command palette, shortcut Command plus K"
            >
              <Command className="w-3 h-3" /> K
            </button>
          </div>
        </form>

        {/* Right: Rate Limit meter & External link */}
        <div className="flex items-center gap-3">
          <RateLimitBadge onOpenTokenModal={onOpenTokenModal} />

          <a
            href={`https://github.com/${currentRepo}`}
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 transition-colors"
            title="View on GitHub"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
