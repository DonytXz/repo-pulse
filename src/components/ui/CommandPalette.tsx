import React, { useState, useEffect, useRef } from 'react'
import { Search, LayoutGrid, GitFork, Sparkles, Key, X, GitCommitVertical, Users } from 'lucide-react'
import { normalizeRepoInput } from '../../utils/repoParser'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onSelectRepo: (repo: string, isDemo?: boolean) => void
  onSelectTab: (tab: 'overview' | 'network' | 'velocity' | 'burndown' | 'contributors' | 'graph') => void
  onToggleDemo: () => void
  onOpenTokenModal: () => void
}

const FEATURED_REPOSITORIES = [
  { name: 'facebook/react', desc: 'The library for web and native user interfaces' },
  { name: 'angular/angular', desc: 'Deliver web apps with confidence' },
  { name: 'vitejs/vite', desc: 'Next Generation Frontend Tooling' },
  { name: 'vercel/next.js', desc: 'The React Framework for the Web' },
  { name: 'tailwindlabs/tailwindcss', desc: 'A utility-first CSS framework for rapid UI development' },
  { name: 'torvalds/linux', desc: 'Linux kernel source tree' },
  { name: 'vuejs/core', desc: 'Progressive JavaScript Framework' },
]

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectRepo,
  onSelectTab,
  onToggleDemo,
  onOpenTokenModal,
}) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Global Cmd+K and Escape keyboard shortcut listener with focus trap
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredRepos = FEATURED_REPOSITORIES.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.desc.toLowerCase().includes(query.toLowerCase())
  )

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      const normalized = normalizeRepoInput(query.trim())
      onSelectRepo(normalized, false)
      onClose()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cmd-title"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cmd-title" className="sr-only">
          Command Palette Navigation
        </h2>

        <div className="relative border-b border-slate-800 px-4 py-3.5 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" aria-hidden="true" />
          <form onSubmit={handleCustomSubmit} className="flex-1" role="search">
            <input
              ref={inputRef}
              id="cmd-input"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
              }}
              placeholder="Search repo, paste URL (e.g. https://github.com/...) or command..."
              aria-label="Search repositories or commands"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              className="w-full bg-transparent border-none text-white placeholder-slate-400 text-sm focus:outline-hidden"
            />
          </form>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-2 max-h-[380px] overflow-y-auto space-y-3 text-xs">
          {/* Direct search hint */}
          {query.trim() && !FEATURED_REPOSITORIES.some((r) => r.name.toLowerCase() === query.trim().toLowerCase()) && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Custom Repository Search
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectRepo(normalizeRepoInput(query.trim()), false)
                  onClose()
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between cursor-pointer text-cyan-400 font-medium focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>Analyze "{normalizeRepoInput(query.trim())}" on GitHub</span>
                <span className="text-[10px] font-mono text-slate-400">Press Enter</span>
              </button>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Quick Actions & Settings
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  onToggleDemo()
                  onClose()
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-3 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" aria-hidden="true" />
                <span>Toggle Offline Demo Snapshot Mode</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onOpenTokenModal()
                  onClose()
                }}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-3 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
              >
                <Key className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
                <span>Configure GitHub Personal Access Token (PAT)</span>
              </button>
            </div>
          </div>

          {/* Navigate Views */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Telemetry Views
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  onSelectTab('overview')
                  onClose()
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                <span>Overview & Heatmap</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('graph')
                  onClose()
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
              >
                <GitCommitVertical className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
                <span>Commit Graph</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('network')
                  onClose()
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-purple-400 transition-colors"
              >
                <GitFork className="w-3.5 h-3.5 text-purple-400 shrink-0" aria-hidden="true" />
                <span>Contributor Network</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('velocity')
                  onClose()
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                <span>PR Velocity</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('burndown')
                  onClose()
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-400 transition-colors"
              >
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Issue Burndown</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSelectTab('contributors')
                  onClose()
                }}
                className="text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-hidden="true" />
                <span>Contributors</span>
              </button>
            </div>
          </div>

          {/* Featured Repositories */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Flagship Repositories
            </div>
            <div className="space-y-1">
              {filteredRepos.map((repo) => (
                <button
                  type="button"
                  key={repo.name}
                  onClick={() => {
                    onSelectRepo(repo.name, false)
                    onClose()
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 flex items-center justify-between gap-3 cursor-pointer text-slate-300 hover:text-white transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <svg className="w-4 h-4 fill-current text-slate-400 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                    <div className="min-w-0">
                      <div className="font-medium text-white truncate">{repo.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{repo.desc}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 px-4 py-2 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Tip: Esc to exit &bull; Cmd+K to toggle anytime</span>
          <span>RepoPulse v1.0</span>
        </div>
      </div>
    </div>
  )
}
