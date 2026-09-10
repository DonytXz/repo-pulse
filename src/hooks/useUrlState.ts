import { useState, useEffect, useCallback } from 'react'
import { normalizeRepoInput } from '../utils/repoParser'

export interface UrlState {
  repo: string
  tab: 'overview' | 'network' | 'velocity' | 'burndown' | 'contributors' | 'graph'
  isDemo: boolean
  highlightedUser?: string
  selectedCommit?: string
}

const DEFAULT_STATE: UrlState = {
  repo: 'facebook/react',
  tab: 'overview',
  isDemo: false,
}

export function parseUrlState(): UrlState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  const params = new URLSearchParams(window.location.search)

  const rawRepo = params.get('repo')
  const repo = rawRepo ? normalizeRepoInput(rawRepo) : DEFAULT_STATE.repo
  const tabParam = params.get('tab')
  const validTabs: UrlState['tab'][] = ['overview', 'network', 'velocity', 'burndown', 'contributors', 'graph']
  const tab = validTabs.includes(tabParam as UrlState['tab']) ? (tabParam as UrlState['tab']) : DEFAULT_STATE.tab
  const isDemo = params.get('demo') === 'true'
  const highlightedUser = params.get('user') || undefined
  const selectedCommit = params.get('commit') || undefined

  return { repo, tab, isDemo, highlightedUser, selectedCommit }
}

export function useUrlState() {
  const [state, setStateInternal] = useState<UrlState>(parseUrlState)

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setStateInternal(parseUrlState())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const setUrlState = useCallback((updater: Partial<UrlState> | ((prev: UrlState) => Partial<UrlState>)) => {
    setStateInternal((prev) => {
      const nextChanges = typeof updater === 'function' ? updater(prev) : updater
      const next = { ...prev, ...nextChanges }

      const params = new URLSearchParams()
      if (next.repo) params.set('repo', normalizeRepoInput(next.repo))
      if (next.tab && next.tab !== 'overview') params.set('tab', next.tab)
      if (next.isDemo) params.set('demo', 'true')
      if (next.highlightedUser) params.set('user', next.highlightedUser)
      if (next.selectedCommit) params.set('commit', next.selectedCommit)

      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}${window.location.hash}`
      if (newUrl !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
        window.history.pushState(null, '', newUrl)
      }

      return next
    })
  }, [])

  return [state, setUrlState] as const
}
