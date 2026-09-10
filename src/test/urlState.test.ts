import { describe, it, expect, beforeEach } from 'vitest'
import { parseUrlState } from '../hooks/useUrlState'

describe('URL State Serialization & Parsing', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/')
  })

  it('parses default state when no query params are present', () => {
    const state = parseUrlState()
    expect(state.repo).toBe('facebook/react')
    expect(state.tab).toBe('overview')
    expect(state.isDemo).toBe(false)
    expect(state.highlightedUser).toBeUndefined()
  })

  it('parses custom repo, tab, demo, and user from query params', () => {
    window.history.pushState(null, '', '/?repo=angular/angular&tab=velocity&demo=true&user=mhevery')
    const state = parseUrlState()

    expect(state.repo).toBe('angular/angular')
    expect(state.tab).toBe('velocity')
    expect(state.isDemo).toBe(true)
    expect(state.highlightedUser).toBe('mhevery')
  })

  it('falls back to default tab if invalid tab is passed in query param', () => {
    window.history.pushState(null, '', '/?repo=vitejs/vite&tab=unknown_tab')
    const state = parseUrlState()

    expect(state.repo).toBe('vitejs/vite')
    expect(state.tab).toBe('overview')
  })
})
