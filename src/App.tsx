import { useState } from 'react'
import { useUrlState } from './hooks/useUrlState'
import { useRepoData } from './hooks/useRepoData'
import { Header } from './components/layout/Header'
import { TokenModal } from './components/layout/TokenModal'
import { CommandPalette } from './components/ui/CommandPalette'
import { ErrorDisplay } from './components/ui/ErrorBoundary'
import { LoadingSkeleton } from './components/ui/LoadingSkeleton'
import { RepoHero } from './components/dashboard/RepoHero'
import { MetricCards } from './components/dashboard/MetricCards'
import { ContributorGraph } from './components/charts/ContributorGraph'
import { CommitHeatmap } from './components/charts/CommitHeatmap'
import { VelocityChart } from './components/charts/VelocityChart'
import { BurndownChart } from './components/charts/BurndownChart'
import { ContributorLeaderboard } from './components/dashboard/ContributorLeaderboard'

export function App() {
  const [urlState, setUrlState] = useUrlState()
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const { data: metrics, isLoading, error, refetch } = useRepoData(
    urlState.repo,
    urlState.isDemo
  )

  const handleSelectRepo = (repo: string, isDemo = false) => {
    setUrlState({ repo, isDemo, highlightedUser: undefined })
  }

  const handleToggleDemo = () => {
    setUrlState((prev) => ({ ...prev, isDemo: !prev.isDemo }))
  }

  const handleSelectTab = (
    tab: 'overview' | 'network' | 'velocity' | 'burndown' | 'contributors'
  ) => {
    setUrlState({ tab })
  }

  const handleSelectUser = (login: string) => {
    setUrlState((prev) => ({
      ...prev,
      highlightedUser: prev.highlightedUser === login ? undefined : login,
    }))
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Header
        currentRepo={urlState.repo}
        isDemo={urlState.isDemo}
        onSelectRepo={handleSelectRepo}
        onToggleDemo={handleToggleDemo}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        {isLoading && <LoadingSkeleton />}

        {error && !isLoading && (
          <ErrorDisplay
            error={error}
            onRetry={() => refetch()}
            onSwitchToDemo={() => setUrlState({ isDemo: true })}
            onOpenTokenModal={() => setIsTokenModalOpen(true)}
          />
        )}

        {metrics && !isLoading && !error && (
          <>
            <RepoHero
              repository={metrics.repository}
              activeTab={urlState.tab}
              onSelectTab={handleSelectTab}
              isDemo={urlState.isDemo}
            />

            {/* Tab: Overview */}
            {urlState.tab === 'overview' && (
              <div className="space-y-6">
                <MetricCards metrics={metrics} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ContributorGraph
                      nodes={metrics.networkGraph.nodes}
                      links={metrics.networkGraph.links}
                      categories={metrics.networkGraph.categories}
                      highlightedUser={urlState.highlightedUser}
                      onSelectContributor={handleSelectUser}
                    />
                  </div>
                  <div>
                    <ContributorLeaderboard
                      contributors={metrics.contributors}
                      highlightedUser={urlState.highlightedUser}
                      onSelectUser={handleSelectUser}
                    />
                  </div>
                </div>

                <CommitHeatmap data={metrics.heatmap} />
              </div>
            )}

            {/* Tab: Contributor Network */}
            {urlState.tab === 'network' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <ContributorGraph
                      nodes={metrics.networkGraph.nodes}
                      links={metrics.networkGraph.links}
                      categories={metrics.networkGraph.categories}
                      highlightedUser={urlState.highlightedUser}
                      onSelectContributor={handleSelectUser}
                    />
                  </div>
                  <div>
                    <ContributorLeaderboard
                      contributors={metrics.contributors}
                      highlightedUser={urlState.highlightedUser}
                      onSelectUser={handleSelectUser}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: PR Velocity */}
            {urlState.tab === 'velocity' && (
              <div className="space-y-6">
                <MetricCards metrics={metrics} />
                <VelocityChart
                  dates={metrics.velocity.dates}
                  openedPRs={metrics.velocity.openedPRs}
                  mergedPRs={metrics.velocity.mergedPRs}
                />
              </div>
            )}

            {/* Tab: Issue Burndown */}
            {urlState.tab === 'burndown' && (
              <div className="space-y-6">
                <MetricCards metrics={metrics} />
                <BurndownChart
                  dates={metrics.burndown.dates}
                  openedIssues={metrics.burndown.openedIssues}
                  closedIssues={metrics.burndown.closedIssues}
                />
              </div>
            )}

            {/* Tab: Contributors */}
            {urlState.tab === 'contributors' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ContributorLeaderboard
                  contributors={metrics.contributors}
                  highlightedUser={urlState.highlightedUser}
                  onSelectUser={handleSelectUser}
                />
                <ContributorGraph
                  nodes={metrics.networkGraph.nodes}
                  links={metrics.networkGraph.links}
                  categories={metrics.networkGraph.categories}
                  highlightedUser={urlState.highlightedUser}
                  onSelectContributor={handleSelectUser}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer / Portfolio Case Study Highlights */}
      <footer className="w-full border-t border-slate-800 bg-slate-950/80 py-8 px-4 lg:px-8 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">RepoPulse</span> &bull;
            <span>100% Client-Side Open-Source Telemetry</span> &bull;
            <span>Zero VPS Backend</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by React 19, Apache ECharts, TanStack Query & Tailwind CSS</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        onTokenUpdated={() => refetch()}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectRepo={handleSelectRepo}
        onSelectTab={handleSelectTab}
        onToggleDemo={handleToggleDemo}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
      />
    </div>
  )
}

export default App
