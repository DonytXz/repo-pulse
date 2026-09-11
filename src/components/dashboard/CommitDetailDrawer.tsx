import React, { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { X, ExternalLink, ShieldCheck, GitCommit, FileCode, Plus, Minus, Copy, Check } from 'lucide-react'
import { fetchCommitDetail } from '../../api/client'
import { MOCK_COMMIT_DETAIL } from '../../api/mockData'
import type { CommitDetail } from '../../api/types'

interface CommitDetailDrawerProps {
  isOpen: boolean
  commitSha: string | null
  repo: string
  isDemo?: boolean
  onClose: () => void
}

export const CommitDetailDrawer: React.FC<CommitDetailDrawerProps> = ({
  isOpen,
  commitSha,
  repo,
  isDemo,
  onClose,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = React.useState(false)

  // Focus trap & Escape key handler
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        if (!drawerRef.current) return
        const focusable = drawerRef.current.querySelectorAll<HTMLElement>(
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
    // Auto-focus drawer close button
    const closeBtn = drawerRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close commit details"]')
    closeBtn?.focus()

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const { data: commitDetail, isLoading, error } = useQuery<CommitDetail>({
    queryKey: ['commit', repo, commitSha],
    queryFn: async () => {
      if (!commitSha) throw new Error('No commit SHA provided')
      if (isDemo) {
        return {
          ...MOCK_COMMIT_DETAIL,
          sha: commitSha,
        }
      }
      const [owner, name] = repo.split('/')
      return fetchCommitDetail(owner, name, commitSha)
    },
    enabled: isOpen && !!commitSha,
    staleTime: 1000 * 60 * 15,
  })

  if (!isOpen || !commitSha) return null

  const handleCopySha = () => {
    if (commitSha) {
      navigator.clipboard.writeText(commitSha)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shortSha = commitSha.slice(0, 7)
  const commitUrl = `https://github.com/${repo}/commit/${commitSha}`

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="commit-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/50 dark:bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={drawerRef}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-800 dark:text-slate-200 overflow-hidden animate-in slide-in-from-right duration-250"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 shrink-0">
              <GitCommit className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 id="commit-drawer-title" className="text-sm font-semibold text-slate-900 dark:text-white truncate flex items-center gap-2">
                <span>Commit</span>
                <span className="font-mono text-cyan-700 dark:text-cyan-400 text-xs px-1.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                  {shortSha}
                </span>
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {repo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopySha}
              aria-label="Copy full commit SHA"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
              title="Copy SHA"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              ) : (
                <Copy className="w-4 h-4" aria-hidden="true" />
              )}
            </button>
            <a
              href={commitUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="View commit on GitHub"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
              title="Open in GitHub"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close commit details"
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-500 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {isLoading && (
            <div className="space-y-4 animate-pulse">
              <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800/60" />
              <div className="h-24 rounded-xl bg-slate-200 dark:bg-slate-800/60" />
              <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800/60" />
            </div>
          )}

          {error && !isLoading && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300">
              <p className="font-semibold mb-1">Failed to load commit details</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          )}

          {commitDetail && !isLoading && (
            <>
              {/* Author & Signature Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {commitDetail.author?.avatar_url ? (
                      <img
                        src={commitDetail.author.avatar_url}
                        alt=""
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-mono text-slate-700 dark:text-slate-300">
                        {commitDetail.commit.author.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {commitDetail.author?.login || commitDetail.commit.author.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {new Date(commitDetail.commit.author.date).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {commitDetail.commit.verification?.verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-medium text-[10px]">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Parents Links */}
                {commitDetail.parents && commitDetail.parents.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800/60 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Parent{commitDetail.parents.length > 1 ? 's' : ''}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {commitDetail.parents.map((p) => (
                        <span key={p.sha} className="font-mono text-cyan-700 dark:text-cyan-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                          {p.sha.slice(0, 7)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Commit Message */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Commit Message
                </span>
                <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {commitDetail.commit.message}
                </pre>
              </div>

              {/* Diff Stats Banner */}
              {commitDetail.stats && (
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Files Changed</span>
                    <span className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                      {commitDetail.files?.length || 0}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                    <span className="text-[10px] block mb-0.5">Additions</span>
                    <span className="text-base font-bold font-mono tabular-nums flex items-center justify-center gap-0.5">
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      {commitDetail.stats.additions}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-400">
                    <span className="text-[10px] block mb-0.5">Deletions</span>
                    <span className="text-base font-bold font-mono tabular-nums flex items-center justify-center gap-0.5">
                      <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      {commitDetail.stats.deletions}
                    </span>
                  </div>
                </div>
              )}

              {/* Files Changed List */}
              {commitDetail.files && commitDetail.files.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block px-1">
                    Changed Files ({commitDetail.files.length})
                  </span>
                  <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
                    {commitDetail.files.map((file) => (
                      <div
                        key={file.sha || file.filename}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileCode className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                          <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate" title={file.filename}>
                            {file.filename}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                          <span
                            className={`px-1.5 py-0.5 rounded-md font-semibold uppercase ${
                              file.status === 'added'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                                : file.status === 'removed'
                                ? 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                                : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                            }`}
                          >
                            {file.status}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">+{file.additions}</span>
                          <span className="text-rose-600 dark:text-rose-400 tabular-nums">-{file.deletions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            Press Esc to exit
          </span>
          <a
            href={commitUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-cyan-300 shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            <span>Open on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  )
}
