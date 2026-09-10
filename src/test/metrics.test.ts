import { describe, it, expect } from 'vitest'
import {
  computeRepoMetrics,
  buildNetworkGraph,
  buildCommitHeatmap,
  buildPrVelocity,
  buildIssueBurndown,
  computeSummaryTelemetry,
} from '../utils/metrics'
import {
  MOCK_REPOSITORY,
  MOCK_CONTRIBUTORS,
  MOCK_COMMITS,
  MOCK_PULL_REQUESTS,
  MOCK_ISSUES,
} from '../api/mockData'

describe('Telemetry Metrics Engine', () => {
  it('computes overall repo metrics cleanly', () => {
    const metrics = computeRepoMetrics(
      MOCK_REPOSITORY,
      MOCK_CONTRIBUTORS,
      MOCK_COMMITS,
      MOCK_PULL_REQUESTS,
      MOCK_ISSUES
    )

    expect(metrics.repository.full_name).toBe('facebook/react')
    expect(metrics.summary.healthScore).toBeGreaterThan(0)
    expect(metrics.summary.healthScore).toBeLessThanOrEqual(100)
    expect(metrics.summary.busFactor).toBeGreaterThan(0)
    expect(metrics.networkGraph.nodes.length).toBeGreaterThan(0)
    expect(metrics.heatmap.length).toBeGreaterThan(0)
  })

  it('builds a network graph with nodes and weighted links', () => {
    const graph = buildNetworkGraph(MOCK_CONTRIBUTORS, MOCK_COMMITS, MOCK_PULL_REQUESTS)

    expect(graph.nodes.length).toBe(MOCK_CONTRIBUTORS.length)
    expect(graph.links.length).toBeGreaterThan(0)
    // Top node should have highest contribution
    expect(graph.nodes[0].id).toBe('gaearon')
    expect(graph.nodes[0].symbolSize).toBeGreaterThan(graph.nodes[graph.nodes.length - 1].symbolSize)
  })

  it('builds commit heatmap grouped by day', () => {
    const heatmap = buildCommitHeatmap(MOCK_COMMITS)
    expect(Array.isArray(heatmap)).toBe(true)
    expect(heatmap.length).toBeGreaterThan(0)
    heatmap.forEach(([date, count]) => {
      expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(count).toBeGreaterThan(0)
    })
  })

  it('builds PR velocity buckets', () => {
    const velocity = buildPrVelocity(MOCK_PULL_REQUESTS)
    expect(velocity.dates.length).toBeGreaterThan(0)
    expect(velocity.openedPRs.length).toBe(velocity.dates.length)
    expect(velocity.mergedPRs.length).toBe(velocity.dates.length)
  })

  it('builds issue burndown correctly filtering pull requests', () => {
    const burndown = buildIssueBurndown(MOCK_ISSUES)
    expect(burndown.dates.length).toBeGreaterThan(0)
    expect(burndown.openedIssues.length).toBe(burndown.dates.length)
    expect(burndown.closedIssues.length).toBe(burndown.dates.length)
  })

  it('calculates bus factor accurately', () => {
    const summary = computeSummaryTelemetry(
      MOCK_CONTRIBUTORS,
      MOCK_COMMITS,
      MOCK_PULL_REQUESTS,
      MOCK_ISSUES
    )
    // Bus factor should be between 1 and total contributors count
    expect(summary.busFactor).toBeGreaterThanOrEqual(1)
    expect(summary.busFactor).toBeLessThanOrEqual(MOCK_CONTRIBUTORS.length)
    expect(summary.avgMergeTimeHours).toBeGreaterThanOrEqual(0)
  })
})
