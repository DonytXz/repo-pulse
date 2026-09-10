import { useQuery } from '@tanstack/react-query'
import {
  fetchRepository,
  fetchContributors,
  fetchCommits,
  fetchPullRequests,
  fetchIssues,
  GitHubApiError,
} from '../api/client'
import { computeRepoMetrics } from '../utils/metrics'
import { MOCK_METRICS } from '../api/mockData'
import type { RepoMetrics } from '../api/types'

export function useRepoData(repoFullName: string, isDemo: boolean) {
  return useQuery<RepoMetrics, GitHubApiError>({
    queryKey: ['repoMetrics', repoFullName, isDemo],
    queryFn: async () => {
      if (isDemo) {
        // Return pre-bundled offline fixture immediately
        return MOCK_METRICS
      }

      const clean = repoFullName.trim().replace(/^https?:\/\/github\.com\//, '')
      const parts = clean.split('/')
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        throw new Error('Please enter a valid GitHub repository in "owner/repo" format (e.g. facebook/react).')
      }

      const [owner, repo] = parts

      // Fetch telemetry data in parallel with error capture
      const [repository, contributors, commits, pullRequests, issues] = await Promise.all([
        fetchRepository(owner, repo),
        fetchContributors(owner, repo).catch((err) => {
          if (err.isRateLimit) throw err
          return []
        }),
        fetchCommits(owner, repo).catch((err) => {
          if (err.isRateLimit) throw err
          return []
        }),
        fetchPullRequests(owner, repo, 'all').catch((err) => {
          if (err.isRateLimit) throw err
          return []
        }),
        fetchIssues(owner, repo, 'all').catch((err) => {
          if (err.isRateLimit) throw err
          return []
        }),
      ])

      return computeRepoMetrics(repository, contributors, commits, pullRequests, issues)
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    gcTime: 30 * 60 * 1000, // 30 minutes cache retention
    retry: (failureCount, error) => {
      // Do not retry on rate limit exhaustion or 404
      if (error instanceof GitHubApiError && (error.isRateLimit || error.status === 404)) {
        return false
      }
      return failureCount < 1
    },
  })
}
