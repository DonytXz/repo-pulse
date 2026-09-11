import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import axe from 'axe-core'
import { MetricCards } from '../components/dashboard/MetricCards'
import { ContributorLeaderboard } from '../components/dashboard/ContributorLeaderboard'
import { ErrorDisplay } from '../components/ui/ErrorBoundary'
import { TokenModal } from '../components/layout/TokenModal'
import { CommandPalette } from '../components/ui/CommandPalette'
import { RepoHero } from '../components/dashboard/RepoHero'
import { CommitGraph } from '../components/charts/CommitGraph'
import { CommitDetailDrawer } from '../components/dashboard/CommitDetailDrawer'
import { ThemeProvider } from '../context/ThemeContext'
import { MOCK_METRICS, MOCK_COMMITS, MOCK_BRANCHES } from '../api/mockData'

const renderWithTheme = (ui: React.ReactElement) => render(ui, { wrapper: ThemeProvider })

describe('Automated Accessibility (axe-core)', () => {
  it('MetricCards has no axe violations', async () => {
    const { container } = renderWithTheme(<MetricCards metrics={MOCK_METRICS} />)
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('ContributorLeaderboard has no axe violations', async () => {
    const { container } = renderWithTheme(
      <ContributorLeaderboard
        contributors={MOCK_METRICS.contributors}
        onSelectUser={vi.fn()}
      />
    )
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('ErrorDisplay has no axe violations', async () => {
    const { container } = renderWithTheme(
      <ErrorDisplay
        error={new Error('Test error')}
        onRetry={vi.fn()}
        onSwitchToDemo={vi.fn()}
        onOpenTokenModal={vi.fn()}
      />
    )
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('TokenModal has no axe violations', async () => {
    const { container } = renderWithTheme(
      <TokenModal isOpen={true} onClose={vi.fn()} onTokenUpdated={vi.fn()} />
    )
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('CommandPalette has no axe violations', async () => {
    const { container } = renderWithTheme(
      <CommandPalette
        isOpen={true}
        onClose={vi.fn()}
        onSelectRepo={vi.fn()}
        onSelectTab={vi.fn()}
        onToggleDemo={vi.fn()}
        onOpenTokenModal={vi.fn()}
      />
    )
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('RepoHero has no axe violations', async () => {
    const { container } = renderWithTheme(
      <div>
        <RepoHero
          repository={MOCK_METRICS.repository}
          activeTab="overview"
          onSelectTab={vi.fn()}
          isDemo={false}
        />
        <div id="tabpanel-overview" role="tabpanel" aria-labelledby="tab-overview" />
      </div>
    )
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('CommitGraph has no axe violations', async () => {
    const { container } = renderWithTheme(
      <CommitGraph
        commits={MOCK_COMMITS}
        branches={MOCK_BRANCHES}
        onSelectCommit={vi.fn()}
      />
    )
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('CommitDetailDrawer has no axe violations', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const { container, findByText } = renderWithTheme(
      <QueryClientProvider client={queryClient}>
        <CommitDetailDrawer
          isOpen={true}
          commitSha="c_merge_01"
          repo="facebook/react"
          isDemo={true}
          onClose={vi.fn()}
        />
      </QueryClientProvider>
    )
    await findByText(/Enable memoization passes/i)
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })
})
