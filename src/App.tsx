import { useState, lazy, Suspense } from 'react'
import { useUrlState } from './hooks/useUrlState'
import { useRepoData, useBranches } from './hooks/useRepoData'
import { Header } from './components/layout/Header'
import { TokenModal } from './components/layout/TokenModal'
import { CommandPalette } from './components/ui/CommandPalette'
import { ErrorDisplay } from './components/ui/ErrorBoundary'
import { LoadingSkeleton } from './components/ui/LoadingSkeleton'
import { RepoHero } from './components/dashboard/RepoHero'
import { MetricCards } from './components/dashboard/MetricCards'
import { ContributorLeaderboard } from './components/dashboard/ContributorLeaderboard'

// Code-split heavy chart components
const ContributorGraph = lazy(() =>
  import('./components/charts/ContributorGraph').then((m) => ({ default: m.ContributorGraph }))
)
const CommitHeatmap = lazy(() =>
  import('./components/charts/CommitHeatmap').then((m) => ({ default: m.CommitHeatmap }))
)
const VelocityChart = lazy(() =>
  import('./components/charts/VelocityChart').then((m) => ({ default: m.VelocityChart }))
)
const BurndownChart = lazy(() =>
  import('./components/charts/BurndownChart').then((m) => ({ default: m.BurndownChart }))
)
const CommitGraph = lazy(() =>
  import('./components/charts/CommitGraph').then((m) => ({ default: m.CommitGraph }))
)
const CommitDetailDrawer = lazy(() =>
  import('./components/dashboard/CommitDetailDrawer').then((m) => ({ default: m.CommitDetailDrawer }))
)

const ChartFallback = () => (
  <div
    role="status"
    aria-label="Loading telemetry visualization"
    className="w-full h-[320px] rounded-2xl bg-slate-900/40 border border-slate-800 animate-pulse flex items-center justify-center text-slate-400 text-xs"
  >
    Loading telemetry visualization...
  </div>
)

export function App() {
  const [urlState, setUrlState] = useUrlState()
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const { data: metrics, isLoading, error, refetch } = useRepoData(
    urlState.repo,
    urlState.isDemo
  )

  const { data: branches } = useBranches(
    urlState.repo,
    urlState.isDemo
  )

  const handleSelectRepo = (repo: string, isDemo = false) => {
    setUrlState({ repo, isDemo, highlightedUser: undefined, selectedCommit: undefined })
  }

  const handleToggleDemo = () => {
    setUrlState((prev) => ({ ...prev, isDemo: !prev.isDemo }))
  }

  const handleSelectTab = (
    tab: 'overview' | 'network' | 'velocity' | 'burndown' | 'contributors' | 'graph'
  ) => {
    setUrlState({ tab })
  }

  const handleSelectUser = (login: string) => {
    setUrlState((prev) => ({
      ...prev,
      highlightedUser: prev.highlightedUser === login ? undefined : login,
    }))
  }

  const handleSelectCommit = (sha: string) => {
    setUrlState({ selectedCommit: sha })
  }

  const handleCloseCommitDrawer = () => {
    setUrlState({ selectedCommit: undefined })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-semibold focus:rounded-xl focus:shadow-xl focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      <Header
        key={urlState.repo}
        currentRepo={urlState.repo}
        isDemo={urlState.isDemo}
        onSelectRepo={handleSelectRepo}
        onToggleDemo={handleToggleDemo}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 focus:outline-hidden"
      >
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
              <div
                role="tabpanel"
                id="tabpanel-overview"
                aria-labelledby="tab-overview"
                className="space-y-6"
              >
                <MetricCards metrics={metrics} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Suspense fallback={<ChartFallback />}>
                      <ContributorGraph
                        nodes={metrics.networkGraph.nodes}
                        links={metrics.networkGraph.links}
                        categories={metrics.networkGraph.categories}
                        highlightedUser={urlState.highlightedUser}
                        onSelectContributor={handleSelectUser}
                      />
                    </Suspense>
                  </div>
                  <div>
                    <ContributorLeaderboard
                      contributors={metrics.contributors}
                      highlightedUser={urlState.highlightedUser}
                      onSelectUser={handleSelectUser}
                    />
                  </div>
                </div>

                <Suspense fallback={<ChartFallback />}>
                  <CommitHeatmap data={metrics.heatmap} />
                </Suspense>
              </div>
            )}

            {/* Tab: Contributor Network */}
            {urlState.tab === 'network' && (
              <div
                role="tabpanel"
                id="tabpanel-network"
                aria-labelledby="tab-network"
                className="space-y-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Suspense fallback={<ChartFallback />}>
                      <ContributorGraph
                        nodes={metrics.networkGraph.nodes}
                        links={metrics.networkGraph.links}
                        categories={metrics.networkGraph.categories}
                        highlightedUser={urlState.highlightedUser}
                        onSelectContributor={handleSelectUser}
                      />
                    </Suspense>
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
              <div
                role="tabpanel"
                id="tabpanel-velocity"
                aria-labelledby="tab-velocity"
                className="space-y-6"
              >
                <MetricCards metrics={metrics} />
                <Suspense fallback={<ChartFallback />}>
                  <VelocityChart
                    dates={metrics.velocity.dates}
                    openedPRs={metrics.velocity.openedPRs}
                    mergedPRs={metrics.velocity.mergedPRs}
                  />
                </Suspense>
              </div>
            )}

            {/* Tab: Issue Burndown */}
            {urlState.tab === 'burndown' && (
              <div
                role="tabpanel"
                id="tabpanel-burndown"
                aria-labelledby="tab-burndown"
                className="space-y-6"
              >
                <MetricCards metrics={metrics} />
                <Suspense fallback={<ChartFallback />}>
                  <BurndownChart
                    dates={metrics.burndown.dates}
                    openedIssues={metrics.burndown.openedIssues}
                    closedIssues={metrics.burndown.closedIssues}
                  />
                </Suspense>
              </div>
            )}

            {/* Tab: Commit Graph */}
            {urlState.tab === 'graph' && (
              <div
                role="tabpanel"
                id="tabpanel-graph"
                aria-labelledby="tab-graph"
                className="space-y-6"
              >
                <Suspense fallback={<ChartFallback />}>
                  <CommitGraph
                    commits={metrics.commits}
                    branches={branches || []}
                    selectedSha={urlState.selectedCommit}
                    onSelectCommit={handleSelectCommit}
                  />
                </Suspense>
              </div>
            )}

            {/* Tab: Contributors */}
            {urlState.tab === 'contributors' && (
              <div
                role="tabpanel"
                id="tabpanel-contributors"
                aria-labelledby="tab-contributors"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <ContributorLeaderboard
                  contributors={metrics.contributors}
                  highlightedUser={urlState.highlightedUser}
                  onSelectUser={handleSelectUser}
                />
                <Suspense fallback={<ChartFallback />}>
                  <ContributorGraph
                    nodes={metrics.networkGraph.nodes}
                    links={metrics.networkGraph.links}
                    categories={metrics.networkGraph.categories}
                    highlightedUser={urlState.highlightedUser}
                    onSelectContributor={handleSelectUser}
                  />
                </Suspense>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer / Portfolio Case Study Highlights */}
      <footer className="w-full border-t border-slate-800 bg-slate-950/80 py-8 px-4 lg:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">RepoPulse</span> &bull;
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

      <Suspense fallback={null}>
        <CommitDetailDrawer
          isOpen={!!urlState.selectedCommit}
          commitSha={urlState.selectedCommit || null}
          repo={urlState.repo}
          isDemo={urlState.isDemo}
          onClose={handleCloseCommitDrawer}
        />
      </Suspense>
    </div>
  )
}

export default App
