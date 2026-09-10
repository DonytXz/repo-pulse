export interface RepositoryInfo {
  id: number
  name: string
  full_name: string
  description: string | null
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  subscribers_count: number
  default_branch: string
  created_at: string
  updated_at: string
  pushed_at: string
  topics: string[]
  language: string | null
  license: {
    key: string
    name: string
    spdx_id: string
  } | null
  owner: {
    login: string
    avatar_url: string
    html_url: string
  }
}

export interface Contributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

export interface CommitItem {
  sha: string
  parents?: Array<{ sha: string }>
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    committer: {
      name: string
      email: string
      date: string
    }
    message: string
    verification?: {
      verified: boolean
      reason?: string
    }
  }
  author: {
    login: string
    id: number
    avatar_url: string
  } | null
}

export interface BranchInfo {
  name: string
  commit: {
    sha: string
    url?: string
  }
  protected?: boolean
}

export interface CommitFileChange {
  sha: string
  filename: string
  status: 'added' | 'removed' | 'modified' | 'renamed'
  additions: number
  deletions: number
  changes: number
  patch?: string
}

export interface CommitDetail extends CommitItem {
  stats?: {
    total: number
    additions: number
    deletions: number
  }
  files?: CommitFileChange[]
}

export interface GraphBadge {
  name: string
  type: 'branch' | 'tag' | 'head'
}

export interface GraphRoute {
  fromTrack: number
  toTrack: number
  type: 'straight' | 'branch' | 'merge'
}

export interface GraphCommit extends CommitItem {
  trackIndex: number
  color: string
  routes: GraphRoute[]
  badges: GraphBadge[]
}

export interface PullRequestItem {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  closed_at: string | null
  merged_at: string | null
  user: {
    login: string
    avatar_url: string
  }
}

export interface IssueItem {
  id: number
  number: number
  title: string
  state: 'open' | 'closed'
  created_at: string
  updated_at: string
  closed_at: string | null
  pull_request?: {
    url: string
  }
  user: {
    login: string
    avatar_url: string
  }
}

export interface RateLimitStatus {
  limit: number
  remaining: number
  reset: number // unix timestamp (seconds)
  used: number
  lastUpdated: number // js timestamp (ms)
}

export interface NetworkNode {
  id: string
  name: string
  avatar: string
  value: number // contribution weight
  category: number // community cluster id
  symbolSize: number
}

export interface NetworkLink {
  source: string
  target: string
  value: number // connection strength
}

export interface RepoMetrics {
  repository: RepositoryInfo
  contributors: Contributor[]
  commits: CommitItem[]
  pullRequests: PullRequestItem[]
  issues: IssueItem[]
  summary: {
    healthScore: number // 0 to 100
    busFactor: number
    avgMergeTimeHours: number
    totalCommitsAnalyzed: number
    activeContributorsCount: number
    prMergeRate: number // percentage 0 to 100
    issueResolutionRate: number // percentage 0 to 100
  }
  heatmap: Array<[string, number]> // [YYYY-MM-DD, commitCount]
  networkGraph: {
    nodes: NetworkNode[]
    links: NetworkLink[]
    categories: Array<{ name: string }>
  }
  velocity: {
    dates: string[]
    openedPRs: number[]
    mergedPRs: number[]
  }
  burndown: {
    dates: string[]
    openedIssues: number[]
    closedIssues: number[]
  }
}
