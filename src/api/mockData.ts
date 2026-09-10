import type {
  CommitItem,
  Contributor,
  IssueItem,
  PullRequestItem,
  RepositoryInfo,
  RepoMetrics,
  BranchInfo,
  CommitDetail,
} from './types'
import { computeRepoMetrics } from '../utils/metrics'

export const MOCK_REPOSITORY: RepositoryInfo = {
  id: 10270250,
  name: 'react',
  full_name: 'facebook/react',
  description: 'The library for web and native user interfaces.',
  stargazers_count: 231450,
  forks_count: 46200,
  open_issues_count: 1240,
  subscribers_count: 6580,
  default_branch: 'main',
  created_at: '2013-05-24T16:15:54Z',
  updated_at: '2025-01-15T12:00:00Z',
  pushed_at: '2025-01-15T10:30:00Z',
  topics: ['javascript', 'react', 'ui', 'frontend', 'declarative', 'library'],
  language: 'JavaScript',
  license: {
    key: 'mit',
    name: 'MIT License',
    spdx_id: 'MIT',
  },
  owner: {
    login: 'facebook',
    avatar_url: 'https://avatars.githubusercontent.com/u/69631?v=4',
    html_url: 'https://github.com/facebook',
  },
}

export const MOCK_CONTRIBUTORS: Contributor[] = [
  { id: 1, login: 'gaearon', avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4', html_url: 'https://github.com/gaearon', contributions: 1845, type: 'User' },
  { id: 2, login: 'acdlite', avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4', html_url: 'https://github.com/acdlite', contributions: 1420, type: 'User' },
  { id: 3, login: 'sophiebits', avatar_url: 'https://avatars.githubusercontent.com/u/6820?v=4', html_url: 'https://github.com/sophiebits', contributions: 1210, type: 'User' },
  { id: 4, login: 'sebmarkbage', avatar_url: 'https://avatars.githubusercontent.com/u/63648?v=4', html_url: 'https://github.com/sebmarkbage', contributions: 980, type: 'User' },
  { id: 5, login: 'zpao', avatar_url: 'https://avatars.githubusercontent.com/u/8445?v=4', html_url: 'https://github.com/zpao', contributions: 890, type: 'User' },
  { id: 6, login: 'bvaughn', avatar_url: 'https://avatars.githubusercontent.com/u/29597?v=4', html_url: 'https://github.com/bvaughn', contributions: 750, type: 'User' },
  { id: 7, login: 'rickhanlonii', avatar_url: 'https://avatars.githubusercontent.com/u/2440089?v=4', html_url: 'https://github.com/rickhanlonii', contributions: 620, type: 'User' },
  { id: 8, login: 'trueadm', avatar_url: 'https://avatars.githubusercontent.com/u/1519870?v=4', html_url: 'https://github.com/trueadm', contributions: 540, type: 'User' },
  { id: 9, login: 'kassens', avatar_url: 'https://avatars.githubusercontent.com/u/11849?v=4', html_url: 'https://github.com/kassens', contributions: 430, type: 'User' },
  { id: 10, login: 'eps1lon', avatar_url: 'https://avatars.githubusercontent.com/u/12292047?v=4', html_url: 'https://github.com/eps1lon', contributions: 390, type: 'User' },
  { id: 11, login: 'gnoff', avatar_url: 'https://avatars.githubusercontent.com/u/2292212?v=4', html_url: 'https://github.com/gnoff', contributions: 320, type: 'User' },
  { id: 12, login: 'lunaruan', avatar_url: 'https://avatars.githubusercontent.com/u/1324872?v=4', html_url: 'https://github.com/lunaruan', contributions: 280, type: 'User' },
  { id: 13, login: 'jackiesmith', avatar_url: 'https://avatars.githubusercontent.com/u/3820409?v=4', html_url: 'https://github.com/jackiesmith', contributions: 240, type: 'User' },
  { id: 14, login: 'necolas', avatar_url: 'https://avatars.githubusercontent.com/u/239676?v=4', html_url: 'https://github.com/necolas', contributions: 210, type: 'User' },
  { id: 15, login: 'chenglou', avatar_url: 'https://avatars.githubusercontent.com/u/1909539?v=4', html_url: 'https://github.com/chenglou', contributions: 180, type: 'User' },
]

export const MOCK_BRANCHES: BranchInfo[] = [
  { name: 'main', commit: { sha: 'c_merge_01' }, protected: true },
  { name: 'feat/compiler', commit: { sha: 'c_comp_02' }, protected: false },
  { name: 'fix/ssr-hydration', commit: { sha: 'c_hydr_02' }, protected: false },
]

export const MOCK_COMMIT_DETAIL: CommitDetail = {
  sha: 'c_merge_01',
  parents: [{ sha: 'c_main_01' }, { sha: 'c_comp_02' }],
  commit: {
    author: { name: 'acdlite', email: 'acdlite@fb.com', date: '2025-01-14T14:30:00Z' },
    committer: { name: 'GitHub', email: 'noreply@github.com', date: '2025-01-14T14:30:00Z' },
    message: 'Merge pull request #31050 from facebook/feat/compiler\n\nEnable memoization passes for async components in React 19',
    verification: { verified: true, reason: 'valid' },
  },
  author: {
    login: 'acdlite',
    id: 3624098,
    avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4',
  },
  stats: {
    total: 342,
    additions: 295,
    deletions: 47,
  },
  files: [
    {
      sha: 'f101',
      filename: 'packages/react-compiler/src/index.ts',
      status: 'modified',
      additions: 120,
      deletions: 12,
      changes: 132,
      patch: '@@ -42,8 +42,12 @@ export function compileComponent(fn) {\n+  optimizeMemoizationScope(fn);\n+  validateAsyncDependencies(fn);\n }',
    },
    {
      sha: 'f102',
      filename: 'packages/react-reconciler/src/ReactFiberWorkLoop.ts',
      status: 'modified',
      additions: 85,
      deletions: 25,
      changes: 110,
    },
    {
      sha: 'f103',
      filename: 'packages/react-compiler/__tests__/compiler-test.ts',
      status: 'added',
      additions: 90,
      deletions: 10,
      changes: 100,
    },
  ],
}

export const MOCK_COMMITS: CommitItem[] = generateMockCommits()

function generateMockCommits(): CommitItem[] {
  // 1. Handcrafted topological DAG sequence showing branches and merges
  const dag: CommitItem[] = [
    {
      sha: 'c_merge_01',
      parents: [{ sha: 'c_main_01' }, { sha: 'c_comp_02' }],
      commit: {
        author: { name: 'acdlite', email: 'acdlite@fb.com', date: '2025-01-14T14:30:00Z' },
        committer: { name: 'GitHub', email: 'noreply@github.com', date: '2025-01-14T14:30:00Z' },
        message: 'Merge pull request #31050 from facebook/feat/compiler\n\nEnable memoization passes for async components in React 19',
        verification: { verified: true },
      },
      author: { login: 'acdlite', id: 3624098, avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4' },
    },
    {
      sha: 'c_comp_02',
      parents: [{ sha: 'c_comp_01' }],
      commit: {
        author: { name: 'acdlite', email: 'acdlite@fb.com', date: '2025-01-13T18:20:00Z' },
        committer: { name: 'acdlite', email: 'acdlite@fb.com', date: '2025-01-13T18:20:00Z' },
        message: 'feat(compiler): optimize react compiler dead code elimination pass',
      },
      author: { login: 'acdlite', id: 3624098, avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4' },
    },
    {
      sha: 'c_main_01',
      parents: [{ sha: 'c_merge_02' }],
      commit: {
        author: { name: 'gaearon', email: 'dan@fb.com', date: '2025-01-12T11:00:00Z' },
        committer: { name: 'gaearon', email: 'dan@fb.com', date: '2025-01-12T11:00:00Z' },
        message: 'release: prepare React 19.0.0 changelog and migration guide',
      },
      author: { login: 'gaearon', id: 810438, avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4' },
    },
    {
      sha: 'c_comp_01',
      parents: [{ sha: 'c_main_02' }],
      commit: {
        author: { name: 'acdlite', email: 'acdlite@fb.com', date: '2025-01-11T16:45:00Z' },
        committer: { name: 'acdlite', email: 'acdlite@fb.com', date: '2025-01-11T16:45:00Z' },
        message: 'feat(compiler): initial babel transform passes for server components',
      },
      author: { login: 'acdlite', id: 3624098, avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4' },
    },
    {
      sha: 'c_merge_02',
      parents: [{ sha: 'c_main_02' }, { sha: 'c_hydr_02' }],
      commit: {
        author: { name: 'sebmarkbage', email: 'seb@fb.com', date: '2025-01-10T15:30:00Z' },
        committer: { name: 'GitHub', email: 'noreply@github.com', date: '2025-01-10T15:30:00Z' },
        message: 'Merge pull request #31051 from facebook/fix/hydration\n\nHydrate nested Suspense boundaries gracefully',
        verification: { verified: true },
      },
      author: { login: 'sebmarkbage', id: 63648, avatar_url: 'https://avatars.githubusercontent.com/u/63648?v=4' },
    },
    {
      sha: 'c_hydr_02',
      parents: [{ sha: 'c_hydr_01' }],
      commit: {
        author: { name: 'sebmarkbage', email: 'seb@fb.com', date: '2025-01-09T14:15:00Z' },
        committer: { name: 'sebmarkbage', email: 'seb@fb.com', date: '2025-01-09T14:15:00Z' },
        message: 'fix(ssr): handle selective hydration queue priority in transitions',
      },
      author: { login: 'sebmarkbage', id: 63648, avatar_url: 'https://avatars.githubusercontent.com/u/63648?v=4' },
    },
    {
      sha: 'c_main_02',
      parents: [{ sha: 'c_main_03' }],
      commit: {
        author: { name: 'rickhanlonii', email: 'rick@fb.com', date: '2025-01-08T10:10:00Z' },
        committer: { name: 'rickhanlonii', email: 'rick@fb.com', date: '2025-01-08T10:10:00Z' },
        message: 'docs: clarify useActionState hook concurrency semantics',
      },
      author: { login: 'rickhanlonii', id: 2440089, avatar_url: 'https://avatars.githubusercontent.com/u/2440089?v=4' },
    },
    {
      sha: 'c_hydr_01',
      parents: [{ sha: 'c_main_03' }],
      commit: {
        author: { name: 'sebmarkbage', email: 'seb@fb.com', date: '2025-01-07T09:25:00Z' },
        committer: { name: 'sebmarkbage', email: 'seb@fb.com', date: '2025-01-07T09:25:00Z' },
        message: 'fix(ssr): initialize fallback state before streaming boundary renders',
      },
      author: { login: 'sebmarkbage', id: 63648, avatar_url: 'https://avatars.githubusercontent.com/u/63648?v=4' },
    },
    {
      sha: 'c_main_03',
      parents: [{ sha: 'c_main_04' }],
      commit: {
        author: { name: 'sophiebits', email: 'sophie@fb.com', date: '2025-01-05T12:00:00Z' },
        committer: { name: 'sophiebits', email: 'sophie@fb.com', date: '2025-01-05T12:00:00Z' },
        message: 'fix: resolve race condition in transition cancellation',
      },
      author: { login: 'sophiebits', id: 6820, avatar_url: 'https://avatars.githubusercontent.com/u/6820?v=4' },
    },
    {
      sha: 'c_main_04',
      parents: [{ sha: 'c_main_05' }],
      commit: {
        author: { name: 'eps1lon', email: 'eps1lon@fb.com', date: '2025-01-03T16:00:00Z' },
        committer: { name: 'eps1lon', email: 'eps1lon@fb.com', date: '2025-01-03T16:00:00Z' },
        message: 'chore: update devDependencies and TypeScript definitions to v5.5',
      },
      author: { login: 'eps1lon', id: 12292047, avatar_url: 'https://avatars.githubusercontent.com/u/12292047?v=4' },
    },
    {
      sha: 'c_main_05',
      parents: [{ sha: 'c_hist_0' }],
      commit: {
        author: { name: 'gaearon', email: 'dan@fb.com', date: '2025-01-01T10:00:00Z' },
        committer: { name: 'gaearon', email: 'dan@fb.com', date: '2025-01-01T10:00:00Z' },
        message: 'refactor: decouple scheduler queue from microtask timings',
      },
      author: { login: 'gaearon', id: 810438, avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4' },
    },
  ]

  // 2. Chained historical commits to provide ample data across the year for heatmaps & charts
  const authors = ['gaearon', 'acdlite', 'sebmarkbage', 'sophiebits', 'bvaughn', 'trueadm']
  const historicalCount = 60
  const baseTime = new Date('2024-12-31T20:00:00Z').getTime()

  for (let i = 0; i < historicalCount; i++) {
    const login = authors[i % authors.length]
    const pastDays = i * 4.5
    const date = new Date(baseTime - pastDays * 86400000).toISOString()
    const sha = `c_hist_${i}`
    const parentSha = i < historicalCount - 1 ? `c_hist_${i + 1}` : undefined

    dag.push({
      sha,
      parents: parentSha ? [{ sha: parentSha }] : [],
      commit: {
        author: { name: login, email: `${login}@users.noreply.github.com`, date },
        committer: { name: login, email: `${login}@users.noreply.github.com`, date },
        message: `perf(core): optimize concurrent reconcile step #${historicalCount - i}`,
      },
      author: {
        login,
        id: Math.floor(Math.random() * 100000),
        avatar_url: `https://avatars.githubusercontent.com/${login}`,
      },
    })
  }

  return dag
}

export const MOCK_PULL_REQUESTS: PullRequestItem[] = [
  { id: 101, number: 31050, title: 'feat(compiler): enable memoization passes for async components', state: 'closed', created_at: '2024-11-01T10:00:00Z', updated_at: '2024-11-03T15:00:00Z', closed_at: '2024-11-03T15:00:00Z', merged_at: '2024-11-03T15:00:00Z', user: { login: 'acdlite', avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4' } },
  { id: 102, number: 31051, title: 'fix(ssr): hydrate nested Suspense boundaries gracefully', state: 'closed', created_at: '2024-11-04T12:00:00Z', updated_at: '2024-11-05T18:00:00Z', closed_at: '2024-11-05T18:00:00Z', merged_at: '2024-11-05T18:00:00Z', user: { login: 'sebmarkbage', avatar_url: 'https://avatars.githubusercontent.com/u/63648?v=4' } },
  { id: 103, number: 31052, title: 'docs: clarify useActionState hook concurrency semantics', state: 'closed', created_at: '2024-11-10T09:00:00Z', updated_at: '2024-11-12T14:00:00Z', closed_at: '2024-11-12T14:00:00Z', merged_at: '2024-11-12T14:00:00Z', user: { login: 'rickhanlonii', avatar_url: 'https://avatars.githubusercontent.com/u/2440089?v=4' } },
  { id: 104, number: 31053, title: 'refactor: decouple scheduler queue from microtask timings', state: 'closed', created_at: '2024-12-01T11:00:00Z', updated_at: '2024-12-04T16:00:00Z', closed_at: '2024-12-04T16:00:00Z', merged_at: '2024-12-04T16:00:00Z', user: { login: 'gaearon', avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4' } },
  { id: 105, number: 31054, title: 'perf: eliminate redundant fiber node allocations', state: 'closed', created_at: '2024-12-10T14:00:00Z', updated_at: '2024-12-11T20:00:00Z', closed_at: '2024-12-11T20:00:00Z', merged_at: '2024-12-11T20:00:00Z', user: { login: 'acdlite', avatar_url: 'https://avatars.githubusercontent.com/u/3624098?v=4' } },
  { id: 106, number: 31055, title: 'chore: update devDependencies and TypeScript definitions', state: 'closed', created_at: '2024-12-15T08:00:00Z', updated_at: '2024-12-16T10:00:00Z', closed_at: '2024-12-16T10:00:00Z', merged_at: '2024-12-16T10:00:00Z', user: { login: 'eps1lon', avatar_url: 'https://avatars.githubusercontent.com/u/12292047?v=4' } },
  { id: 107, number: 31056, title: 'fix: resolve race condition in transition cancellation', state: 'closed', created_at: '2025-01-02T16:00:00Z', updated_at: '2025-01-04T19:00:00Z', closed_at: '2025-01-04T19:00:00Z', merged_at: '2025-01-04T19:00:00Z', user: { login: 'sophiebits', avatar_url: 'https://avatars.githubusercontent.com/u/6820?v=4' } },
  { id: 108, number: 31057, title: 'feat: add support for DOM streaming custom element hydration', state: 'open', created_at: '2025-01-08T10:00:00Z', updated_at: '2025-01-14T11:00:00Z', closed_at: null, merged_at: null, user: { login: 'trueadm', avatar_url: 'https://avatars.githubusercontent.com/u/1519870?v=4' } },
]

export const MOCK_ISSUES: IssueItem[] = [
  { id: 201, number: 29801, title: 'hydration error when using Suspense with fallback on mobile Safari', state: 'closed', created_at: '2024-10-15T12:00:00Z', updated_at: '2024-10-20T16:00:00Z', closed_at: '2024-10-20T16:00:00Z', user: { login: 'webdev-alex', avatar_url: 'https://avatars.githubusercontent.com/u/1001?v=4' } },
  { id: 202, number: 29802, title: 'Memory leak detected in useOptimistic under rapid dispatch', state: 'closed', created_at: '2024-11-01T08:00:00Z', updated_at: '2024-11-10T14:00:00Z', closed_at: '2024-11-10T14:00:00Z', user: { login: 'perf-guru', avatar_url: 'https://avatars.githubusercontent.com/u/1002?v=4' } },
  { id: 203, number: 29803, title: 'Server Action response headers dropped when stream errors', state: 'closed', created_at: '2024-11-15T09:00:00Z', updated_at: '2024-11-22T11:00:00Z', closed_at: '2024-11-22T11:00:00Z', user: { login: 'edge-dev', avatar_url: 'https://avatars.githubusercontent.com/u/1003?v=4' } },
  { id: 204, number: 29804, title: 'Support View Transitions API integration in React Router / Next', state: 'open', created_at: '2024-12-05T14:00:00Z', updated_at: '2025-01-10T17:00:00Z', closed_at: null, user: { login: 'ui-architect', avatar_url: 'https://avatars.githubusercontent.com/u/1004?v=4' } },
  { id: 205, number: 29805, title: 'Clarify error boundary behavior with async server components', state: 'closed', created_at: '2024-12-18T10:00:00Z', updated_at: '2024-12-29T12:00:00Z', closed_at: '2024-12-29T12:00:00Z', user: { login: 'fullstack-sam', avatar_url: 'https://avatars.githubusercontent.com/u/1005?v=4' } },
  { id: 206, number: 29806, title: 'Investigate synthetic event pooling deprecation notice', state: 'open', created_at: '2025-01-05T13:00:00Z', updated_at: '2025-01-12T15:00:00Z', closed_at: null, user: { login: 'js-fanatic', avatar_url: 'https://avatars.githubusercontent.com/u/1006?v=4' } },
]

export const MOCK_METRICS: RepoMetrics = computeRepoMetrics(
  MOCK_REPOSITORY,
  MOCK_CONTRIBUTORS,
  MOCK_COMMITS,
  MOCK_PULL_REQUESTS,
  MOCK_ISSUES
)
