import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import axe from 'axe-core'
import { MetricCards } from '../components/dashboard/MetricCards'
import { ContributorLeaderboard } from '../components/dashboard/ContributorLeaderboard'
import { ErrorDisplay } from '../components/ui/ErrorBoundary'
import { TokenModal } from '../components/layout/TokenModal'
import { CommandPalette } from '../components/ui/CommandPalette'
import { RepoHero } from '../components/dashboard/RepoHero'
import { MOCK_METRICS } from '../api/mockData'

describe('Automated Accessibility (axe-core)', () => {
  it('MetricCards has no axe violations', async () => {
    const { container } = render(<MetricCards metrics={MOCK_METRICS} />)
    const results = await axe.run(container, {
      rules: {
        'color-contrast': { enabled: false },
      },
    })
    expect(results.violations).toEqual([])
  })

  it('ContributorLeaderboard has no axe violations', async () => {
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
})
