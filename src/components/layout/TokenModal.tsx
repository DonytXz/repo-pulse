import React, { useState } from 'react'
import { getStoredToken, setStoredToken, checkRateLimit } from '../../api/client'
import { X, Key, ShieldCheck, ExternalLink, Check, AlertCircle } from 'lucide-react'

interface TokenModalProps {
  isOpen: boolean
  onClose: () => void
  onTokenUpdated?: () => void
}

export const TokenModal: React.FC<TokenModalProps> = ({ isOpen, onClose, onTokenUpdated }) => {
  const [tokenInput, setTokenInput] = useState(() => getStoredToken() || '')
  const [hasExistingToken, setHasExistingToken] = useState(() => !!getStoredToken())
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  if (!isOpen) return null

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)
    setStatusMessage(null)

    try {
      const trimmed = tokenInput.trim()
      setStoredToken(trimmed ? trimmed : null)
      const newStatus = await checkRateLimit()
      setHasExistingToken(!!trimmed)
      setStatusMessage({
        type: 'success',
        text: trimmed
          ? `Token authenticated successfully! Elevated quota: ${newStatus.limit} requests/hr.`
          : 'Token removed. Reverted to standard public quota (60 reqs/hr).',
      })
      onTokenUpdated?.()
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Failed to authenticate token with GitHub API. Please verify token permissions.',
      })
    } finally {
      setIsValidating(false)
    }
  }

  const handleClear = async () => {
    setStoredToken(null)
    setTokenInput('')
    setHasExistingToken(false)
    await checkRateLimit()
    setStatusMessage({ type: 'success', text: 'Token cleared from session storage.' })
    onTokenUpdated?.()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 id="modal-title" className="text-lg font-semibold text-white">
              GitHub API Personal Access Token
            </h2>
            <p className="text-xs text-slate-400">
              Elevate rate limits from 60 to 5,000 requests/hour
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Backend Security Assurance</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your token is stored <strong>only in your browser’s temporary sessionStorage</strong>. It never touches any intermediate server and is dispatched exclusively to <code className="text-slate-300">api.github.com</code>.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="token-input" className="block text-xs font-medium text-slate-300 mb-1.5">
                GitHub Token (Classic or Fine-grained)
              </label>
              <input
                id="token-input"
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all font-mono"
              />
              <div className="mt-1.5 flex justify-between items-center text-xs text-slate-400">
                <span>No scopes required for public repositories</span>
                <a
                  href="https://github.com/settings/tokens/new?description=RepoPulse%20Client&scopes=public_repo"
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  Generate Token <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                }`}
              >
                {statusMessage.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                )}
                <span>{statusMessage.text}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {hasExistingToken ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  Remove Token
                </button>
              ) : (
                <div />
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isValidating}
                  className="px-4 py-2 text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isValidating ? 'Validating...' : 'Save & Verify'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
