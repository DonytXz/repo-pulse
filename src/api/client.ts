import type { RateLimitStatus, RepositoryInfo, Contributor, CommitItem, PullRequestItem, IssueItem } from './types'

const TOKEN_STORAGE_KEY = 'repo_pulse_gh_token'
const GITHUB_API_BASE = 'https://api.github.com'

type RateLimitListener = (status: RateLimitStatus) => void
const rateLimitListeners = new Set<RateLimitListener>()

let currentRateLimit: RateLimitStatus = {
  limit: 60,
  remaining: 60,
  reset: Math.floor(Date.now() / 1000) + 3600,
  used: 0,
  lastUpdated: Date.now(),
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(TOKEN_STORAGE_KEY)
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return
  if (token && token.trim()) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token.trim())
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  }
}

export function subscribeRateLimit(listener: RateLimitListener): () => void {
  rateLimitListeners.add(listener)
  listener(currentRateLimit)
  return () => {
    rateLimitListeners.delete(listener)
  }
}

export function getCurrentRateLimit(): RateLimitStatus {
  return currentRateLimit
}

function updateRateLimitFromHeaders(headers: Headers): void {
  const limit = headers.get('x-ratelimit-limit')
  const remaining = headers.get('x-ratelimit-remaining')
  const reset = headers.get('x-ratelimit-reset')
  const used = headers.get('x-ratelimit-used')

  if (limit && remaining && reset) {
    currentRateLimit = {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
      used: used ? parseInt(used, 10) : parseInt(limit, 10) - parseInt(remaining, 10),
      lastUpdated: Date.now(),
    }
    rateLimitListeners.forEach((fn) => fn(currentRateLimit))
  }
}

export class GitHubApiError extends Error {
  status: number
  isRateLimit: boolean
  resetTime?: Date

  constructor(
    message: string,
    status: number,
    isRateLimit: boolean = false,
    resetTime?: Date
  ) {
    super(message)
    this.name = 'GitHubApiError'
    this.status = status
    this.isRateLimit = isRateLimit
    this.resetTime = resetTime
  }
}

export async function fetchGitHub<T>(endpoint: string): Promise<T> {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const url = endpoint.startsWith('http') ? endpoint : `${GITHUB_API_BASE}${endpoint}`
  const response = await fetch(url, { headers })

  updateRateLimitFromHeaders(response.headers)

  if (!response.ok) {
    const isRateLimit =
      (response.status === 403 && response.headers.get('x-ratelimit-remaining') === '0') ||
      response.status === 429
    const resetHeader = response.headers.get('x-ratelimit-reset')
    const resetTime = resetHeader ? new Date(parseInt(resetHeader, 10) * 1000) : undefined

    let errorMessage = `GitHub API request failed with status ${response.status}`
    try {
      const errorJson = await response.json()
      if (errorJson.message) {
        errorMessage = errorJson.message
      }
    } catch {
      // Ignore JSON parse failure on raw error responses
    }

    if (isRateLimit) {
      errorMessage = `GitHub API rate limit exceeded. Resets at ${resetTime ? resetTime.toLocaleTimeString() : 'the next hour'}. Add a Personal Access Token to elevate your rate limit to 5,000 reqs/hr.`
    } else if (response.status === 401) {
      errorMessage = 'Invalid or expired GitHub Personal Access Token. Please verify your token in the token settings.'
    } else if (response.status === 404) {
      errorMessage = 'Repository not found on GitHub. Please check the spelling of owner/repository.'
    }

    throw new GitHubApiError(errorMessage, response.status, isRateLimit, resetTime)
  }

  return response.json()
}

export async function fetchRepository(owner: string, repo: string): Promise<RepositoryInfo> {
  return fetchGitHub<RepositoryInfo>(`/repos/${owner}/${repo}`)
}

export async function fetchContributors(owner: string, repo: string, perPage = 30): Promise<Contributor[]> {
  return fetchGitHub<Contributor[]>(`/repos/${owner}/${repo}/contributors?per_page=${perPage}`)
}

export async function fetchCommits(owner: string, repo: string, perPage = 100): Promise<CommitItem[]> {
  return fetchGitHub<CommitItem[]>(`/repos/${owner}/${repo}/commits?per_page=${perPage}`)
}

export async function fetchPullRequests(owner: string, repo: string, state: 'all' | 'open' | 'closed' = 'all', perPage = 100): Promise<PullRequestItem[]> {
  return fetchGitHub<PullRequestItem[]>(`/repos/${owner}/${repo}/pulls?state=${state}&per_page=${perPage}&sort=updated&direction=desc`)
}

export async function fetchIssues(owner: string, repo: string, state: 'all' | 'open' | 'closed' = 'all', perPage = 100): Promise<IssueItem[]> {
  return fetchGitHub<IssueItem[]>(`/repos/${owner}/${repo}/issues?state=${state}&per_page=${perPage}&sort=updated&direction=desc`)
}

export async function checkRateLimit(): Promise<RateLimitStatus> {
  try {
    const res = await fetchGitHub<{
      resources: {
        core: {
          limit: number
          remaining: number
          reset: number
          used: number
        }
      }
    }>('/rate_limit')

    const core = res.resources.core
    currentRateLimit = {
      limit: core.limit,
      remaining: core.remaining,
      reset: core.reset,
      used: core.used,
      lastUpdated: Date.now(),
    }
    rateLimitListeners.forEach((fn) => fn(currentRateLimit))
    return currentRateLimit
  } catch {
    return currentRateLimit
  }
}
