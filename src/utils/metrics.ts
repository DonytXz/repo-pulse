import type {
  CommitItem,
  Contributor,
  IssueItem,
  NetworkLink,
  NetworkNode,
  PullRequestItem,
  RepositoryInfo,
  RepoMetrics,
} from '../api/types'

export function computeRepoMetrics(
  repository: RepositoryInfo,
  contributors: Contributor[],
  commits: CommitItem[],
  pullRequests: PullRequestItem[],
  issuesRaw: IssueItem[]
): RepoMetrics {
  // Filter out pull requests from issues list (GitHub issues API returns both)
  const pureIssues = issuesRaw.filter((issue) => !issue.pull_request)

  // 1. Contributor Network Graph computation
  const networkGraph = buildNetworkGraph(contributors, commits, pullRequests)

  // 2. Commit Heatmap
  const heatmap = buildCommitHeatmap(commits)

  // 3. PR Velocity
  const velocity = buildPrVelocity(pullRequests)

  // 4. Issue Burndown
  const burndown = buildIssueBurndown(pureIssues)

  // 5. Summary Telemetry
  const summary = computeSummaryTelemetry(contributors, commits, pullRequests, pureIssues)

  return {
    repository,
    contributors,
    commits,
    pullRequests,
    issues: pureIssues,
    summary,
    heatmap,
    networkGraph,
    velocity,
    burndown,
  }
}

export function buildNetworkGraph(
  contributors: Contributor[],
  commits: CommitItem[],
  pullRequests: PullRequestItem[]
): {
  nodes: NetworkNode[]
  links: NetworkLink[]
  categories: Array<{ name: string }>
} {
  const categories = [
    { name: 'Core Maintainers' },
    { name: 'Frequent Collaborators' },
    { name: 'Active Contributors' },
    { name: 'Community' },
  ]

  const topContributors = contributors.slice(0, 25)
  const totalContributions = topContributors.reduce((acc, c) => acc + c.contributions, 0) || 1

  const nodes: NetworkNode[] = topContributors.map((c, index) => {
    let category = 3
    if (index < 3) category = 0
    else if (index < 8) category = 1
    else if (index < 16) category = 2

    const relativeWeight = c.contributions / totalContributions
    // Node symbol size between 22 and 65
    const symbolSize = Math.max(22, Math.min(65, Math.round(22 + Math.sqrt(relativeWeight) * 55)))

    return {
      id: c.login,
      name: c.login,
      avatar: c.avatar_url,
      value: c.contributions,
      category,
      symbolSize,
    }
  })

  // Build collaboration links based on commit proximity and PR involvement
  const linkWeightMap = new Map<string, number>()
  const validLogins = new Set(nodes.map((n) => n.id))

  // Find co-authors / proximity in commit history
  for (let i = 0; i < commits.length - 1; i++) {
    const a = commits[i].author?.login
    const b = commits[i + 1]?.author?.login
    if (a && b && a !== b && validLogins.has(a) && validLogins.has(b)) {
      const key = [a, b].sort().join(':::')
      linkWeightMap.set(key, (linkWeightMap.get(key) || 0) + 1)
    }
  }

  // Connect PR authors with top core maintainers
  const coreMaintainer = nodes[0]?.id
  if (coreMaintainer) {
    pullRequests.forEach((pr) => {
      const prAuthor = pr.user?.login
      if (prAuthor && prAuthor !== coreMaintainer && validLogins.has(prAuthor)) {
        const key = [prAuthor, coreMaintainer].sort().join(':::')
        linkWeightMap.set(key, (linkWeightMap.get(key) || 0) + 1)
      }
    })
  }

  // Ensure high-ranking nodes have at least one link to form a connected graph
  for (let i = 0; i < Math.min(5, nodes.length); i++) {
    for (let j = i + 1; j < Math.min(5, nodes.length); j++) {
      const key = [nodes[i].id, nodes[j].id].sort().join(':::')
      if (!linkWeightMap.has(key)) {
        linkWeightMap.set(key, 1)
      }
    }
  }

  const links: NetworkLink[] = []
  linkWeightMap.forEach((weight, key) => {
    const [source, target] = key.split(':::')
    links.push({
      source,
      target,
      value: Math.min(10, weight),
    })
  })

  return { nodes, links, categories }
}

export function buildCommitHeatmap(commits: CommitItem[]): Array<[string, number]> {
  const countByDate = new Map<string, number>()

  commits.forEach((item) => {
    const dateStr = item.commit?.author?.date || item.commit?.committer?.date
    if (dateStr) {
      const day = dateStr.slice(0, 10)
      countByDate.set(day, (countByDate.get(day) || 0) + 1)
    }
  })

  const result: Array<[string, number]> = []
  countByDate.forEach((count, date) => {
    result.push([date, count])
  })

  return result.sort((a, b) => a[0].localeCompare(b[0]))
}

export function buildPrVelocity(pullRequests: PullRequestItem[]): {
  dates: string[]
  openedPRs: number[]
  mergedPRs: number[]
} {
  const buckets = new Map<string, { opened: number; merged: number }>()

  pullRequests.forEach((pr) => {
    const openedMonth = pr.created_at.slice(0, 7) // YYYY-MM
    if (!buckets.has(openedMonth)) {
      buckets.set(openedMonth, { opened: 0, merged: 0 })
    }
    buckets.get(openedMonth)!.opened++

    if (pr.merged_at) {
      const mergedMonth = pr.merged_at.slice(0, 7)
      if (!buckets.has(mergedMonth)) {
        buckets.set(mergedMonth, { opened: 0, merged: 0 })
      }
      buckets.get(mergedMonth)!.merged++
    }
  })

  const sortedDates = Array.from(buckets.keys()).sort()
  return {
    dates: sortedDates,
    openedPRs: sortedDates.map((d) => buckets.get(d)!.opened),
    mergedPRs: sortedDates.map((d) => buckets.get(d)!.merged),
  }
}

export function buildIssueBurndown(issues: IssueItem[]): {
  dates: string[]
  openedIssues: number[]
  closedIssues: number[]
} {
  const buckets = new Map<string, { opened: number; closed: number }>()

  issues.forEach((issue) => {
    const openedMonth = issue.created_at.slice(0, 7)
    if (!buckets.has(openedMonth)) {
      buckets.set(openedMonth, { opened: 0, closed: 0 })
    }
    buckets.get(openedMonth)!.opened++

    if (issue.closed_at) {
      const closedMonth = issue.closed_at.slice(0, 7)
      if (!buckets.has(closedMonth)) {
        buckets.set(closedMonth, { opened: 0, closed: 0 })
      }
      buckets.get(closedMonth)!.closed++
    }
  })

  const sortedDates = Array.from(buckets.keys()).sort()
  return {
    dates: sortedDates,
    openedIssues: sortedDates.map((d) => buckets.get(d)!.opened),
    closedIssues: sortedDates.map((d) => buckets.get(d)!.closed),
  }
}

export function computeSummaryTelemetry(
  contributors: Contributor[],
  commits: CommitItem[],
  pullRequests: PullRequestItem[],
  issues: IssueItem[]
): RepoMetrics['summary'] {
  // Bus factor: count of contributors needed for >= 50% contributions
  const totalContributions = contributors.reduce((acc, c) => acc + c.contributions, 0)
  let accumulated = 0
  let busFactor = 0

  for (const c of contributors) {
    accumulated += c.contributions
    busFactor++
    if (accumulated >= totalContributions * 0.5) {
      break
    }
  }
  if (busFactor === 0 && contributors.length > 0) busFactor = 1

  // Average merge time in hours
  const mergedPRs = pullRequests.filter((pr) => pr.merged_at)
  let totalMergeHours = 0
  mergedPRs.forEach((pr) => {
    if (pr.merged_at) {
      const created = new Date(pr.created_at).getTime()
      const merged = new Date(pr.merged_at).getTime()
      totalMergeHours += Math.max(0, (merged - created) / (1000 * 60 * 60))
    }
  })
  const avgMergeTimeHours = mergedPRs.length > 0 ? Math.round((totalMergeHours / mergedPRs.length) * 10) / 10 : 0

  const prMergeRate = pullRequests.length > 0 ? Math.round((mergedPRs.length / pullRequests.length) * 100) : 0

  const closedIssues = issues.filter((i) => i.state === 'closed')
  const issueResolutionRate = issues.length > 0 ? Math.round((closedIssues.length / issues.length) * 100) : 0

  // Composite health score calculation (0 - 100)
  let healthScore = 50
  if (busFactor >= 5) healthScore += 15
  else if (busFactor >= 3) healthScore += 10
  else healthScore -= 5

  if (prMergeRate >= 60) healthScore += 15
  else if (prMergeRate >= 40) healthScore += 10

  if (issueResolutionRate >= 50) healthScore += 10
  else if (issueResolutionRate >= 30) healthScore += 5

  if (contributors.length >= 20) healthScore += 10

  healthScore = Math.min(100, Math.max(10, healthScore))

  return {
    healthScore,
    busFactor,
    avgMergeTimeHours,
    totalCommitsAnalyzed: commits.length,
    activeContributorsCount: contributors.length,
    prMergeRate,
    issueResolutionRate,
  }
}
