import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  getStoredToken,
  setStoredToken,
  getCurrentRateLimit,
  subscribeRateLimit,
  fetchGitHub,
  GitHubApiError,
} from '../api/client'

describe('GitHub API Client & Rate Limiting', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()
  })

  it('manages personal access token in sessionStorage', () => {
    expect(getStoredToken()).toBeNull()

    setStoredToken('ghp_test_token_123456789')
    expect(getStoredToken()).toBe('ghp_test_token_123456789')

    setStoredToken(null)
    expect(getStoredToken()).toBeNull()
  })

  it('subscribes to rate limit updates', () => {
    let received = getCurrentRateLimit()
    const unsubscribe = subscribeRateLimit((status) => {
      received = status
    })

    expect(received.limit).toBeGreaterThan(0)
    unsubscribe()
  })

  it('handles rate limit exceeded response gracefully', async () => {
    const mockHeaders = new Headers({
      'x-ratelimit-limit': '60',
      'x-ratelimit-remaining': '0',
      'x-ratelimit-reset': `${Math.floor(Date.now() / 1000) + 1800}`,
    })

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 403,
      headers: mockHeaders,
      json: async () => ({ message: 'API rate limit exceeded for 127.0.0.1' }),
    })

    await expect(fetchGitHub('/repos/test/repo')).rejects.toThrow(GitHubApiError)
    expect(getCurrentRateLimit().remaining).toBe(0)
  })
})
