# Continuity — Working Memory

## Aktueller Task
- **Projekt:** RepoPulse (Open-Source Ecosystem Intelligence & Contributor Network)
- **Status:** Gate 4 (Implement) & Gate 5 (Verify) Complete
- **Aktives Gate:** 5-VERIFY (Deploy & Final Review)
- **Letzte Aktualisierung:** 2026-09-10

## Letzter Stand & Erledigte Schritte
- [x] Scaffolding: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + ECharts
- [x] Resilient GitHub API Client with rate-limit tracking, HTTP 401/429/404 handling, and sessionStorage PAT modal
- [x] Pre-bundled offline demo snapshot (`facebook/react`)
- [x] Interactive ECharts Force-Directed Contributor Network Graph with typed callbacks and accessible region semantics
- [x] Commit Frequency Heatmap with multi-year scaling, year filter pills, and accessible keyboard states
- [x] PR Velocity and Issue Burndown charts with zoom sliders and accessible regions
- [x] Repository Health Score with progressbar semantics and Bus Factor calculation with tabular-nums
- [x] WCAG 2.1 AA Accessibility enhancements:
  - Skip-to-main-content link for keyboard / screen reader navigation
  - Accessible tablist navigation with active aria-controls and tabpanel roles
  - Focus trapping and Escape key dismiss in TokenModal and CommandPalette
  - Elimination of focusable descendant violations (separated button and external profile link)
  - Full automated axe-core accessibility test suite (6/6 tests passing)
- [x] Deep URL parameter synchronization (`?repo=...&tab=...&user=...`)
- [x] Support full GitHub URLs pasting with automatic normalization (`DonytXz/Pokedex-React`)
- [x] Code-splitting & Performance: React.lazy() for chart bundles + Suspense fallbacks (initial bundle reduced to ~94 kB gzip)
- [x] Automated test suite expanded: 54/54 tests passing across 11 test suites (`vitest`)
- [x] Static build clean & zero lint errors (`oxlint`)
- [x] Deployed live to GitHub Pages: https://donatoalvarez.dev/repo-pulse/

## Betroffene Dateien
| Datei | Zweck |
|---|---|
| `AGENTS.md` | Shared Agent Configuration & Quality Gates |
| `.agent/rules/*` | System rules (continuity, git, testing, security, etc.) |
| `.agent/CONTINUITY.md` | Working memory and status tracker |
| `src/api/client.ts` | Enhanced API error handling & rate limit management |
| `src/components/layout/Header.tsx` | Accessible search form, brand button, and keyboard controls |
| `src/components/layout/TokenModal.tsx` | Accessible modal with focus trap, auto-focus, and Escape dismiss |
| `src/components/ui/CommandPalette.tsx` | Accessible palette with focus trap, semantic buttons, and search |
| `src/components/dashboard/MetricCards.tsx` | Progressbar role, tabular-nums, WCAG AA text contrast |
| `src/components/dashboard/ContributorLeaderboard.tsx` | Clean button/link separation, rank badges, tabular-nums |
| `src/components/dashboard/RepoHero.tsx` | Accessible tablist with dynamic aria-controls |
| `src/components/charts/*` | Typed callbacks and accessible chart regions |
| `src/App.tsx` | Skip link, main tabIndex, tabpanels, code-splitting with React.lazy |
| `src/test/*` | 11 comprehensive unit, integration, and axe-core a11y test suites |

## ⚠️ Mistakes & Learnings
- ❌ ECharts calendar heatmap tried to fit 4.5 years in a single row for multi-year repos.
  → 💡 Unconstrained date ranges break calendar cell aspect ratios.
  → 🔧 Fixed by constraining views to max 1-year (52 weeks) with year selector pills.
- ❌ Nesting `<a>` profile link inside `<button>` contributor card triggered axe-core "Element has focusable descendants".
  → 💡 Interactive elements cannot be nested in other interactive elements.
  → 🔧 Fixed by making item a styled row with the selection button and the external link as siblings.
