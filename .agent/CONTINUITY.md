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
  - Full automated axe-core accessibility test suite (8/8 tests passing)
- [x] Deep URL parameter synchronization (`?repo=...&tab=...&user=...&commit=...`)
- [x] Support full GitHub URLs pasting with automatic normalization (`DonytXz/Pokedex-React`)
- [x] Code-splitting & Performance: React.lazy() for chart and graph bundles + Suspense fallbacks (initial bundle kept under ~95 kB gzip)
- [x] Scope Expansion Implemented:
  - GitHub Issue #1 created: "feat: Visual Git DAG Commit History Graph & Topology Explorer"
  - Feature branch `feat/commit-history-graph` created
  - Built topological subway track allocation engine (`src/utils/gitGraph.ts`) with cubic bezier connectors
  - Built `CommitGraph.tsx` multi-branch SVG visualizer with branch chips (`main`, `HEAD`), search filtering, and keyboard navigation
  - Built `CommitDetailDrawer.tsx` slide-out drawer with file diffs, +/- line stats, PGP verification badge, focus trap, and Escape dismiss
  - PR #2 created to solve Issue #1 and successfully squash-merged into `main`
- [x] Default Light Theme & Persistent Theme Switcher Implemented:
  - Default theme set to `'light'` on first visit
  - `ThemeContext.tsx` with `localStorage` persistence under `'repopulse-theme'`
  - Synchronous FOUC prevention script in `index.html` with `<meta name="color-scheme" content="light dark" />`
  - Tailwind CSS v4 class-based variant `@custom-variant dark (&:where(.dark, .dark *));` in `index.css`
  - Accessible Sun/Moon toggle button in Header
  - Theme toggle quick action in Command Palette (`Cmd + K`)
  - All UI surfaces adapted for WCAG 2.1 AA compliant light & dark contrast
  - ECharts (`CommitHeatmap`, `ContributorGraph`, `VelocityChart`, `BurndownChart`) and SVG `CommitGraph` dynamically restyled
- [x] Automated test suite expanded: 76/76 tests passing across 15 test suites (`vitest` + `axe-core`)
- [x] Static build clean & zero lint errors (`oxlint`)
- [x] Deployed live to GitHub Pages: https://donatoalvarez.dev/repo-pulse/

## Betroffene Dateien
| Datei | Zweck |
|---|---|
| `AGENTS.md` | Shared Agent Configuration & Quality Gates |
| `.agent/rules/*` | System rules (continuity, git, testing, security, etc.) |
| `.agent/CONTINUITY.md` | Working memory and status tracker |
| `index.html` | FOUC prevention script, color-scheme meta tag, light body class |
| `src/index.css` | Tailwind v4 dark variant & theme tokens |
| `src/context/ThemeContext.tsx` | Theme state, toggle, and localStorage persistence |
| `src/components/layout/Header.tsx` | Sun/Moon theme switcher button and light/dark styles |
| `src/components/ui/CommandPalette.tsx` | Theme toggle quick action and light/dark styling |
| `src/components/charts/*` | Dynamic light/dark theme adaptation for ECharts and SVG graph |
| `src/components/dashboard/*` | UI cards, drawers, and metric badges adapted for light/dark |
| `src/test/ThemeContext.test.tsx` | Unit tests for theme provider, toggle, and persistence |
| `src/test/*` | 15 test suites covering theme, DAG, charts, and axe-core a11y |

## ⚠️ Mistakes & Learnings
- ❌ ECharts calendar heatmap tried to fit 4.5 years in a single row for multi-year repos.
  → 💡 Unconstrained date ranges break calendar cell aspect ratios.
  → 🔧 Fixed by constraining views to max 1-year (52 weeks) with year selector pills.
- ❌ Nesting `<a>` profile link inside `<button>` contributor card triggered axe-core "Element has focusable descendants".
  → 💡 Native buttons must never enclose interactive anchors.
  → 🔧 Fixed by decoupling the button to contributor details and making the external profile icon an adjacent sibling.
- ❌ Tailwind v4 dark mode uses `@media (prefers-color-scheme: dark)` by default.
  → 💡 For manual/class-based theme toggling (`.dark`), Tailwind CSS v4 requires `@custom-variant dark (&:where(.dark, .dark *));`.
  → 🔧 Configured in `src/index.css`.

  → 💡 Interactive elements cannot be nested in other interactive elements.
  → 🔧 Fixed by making item a styled row with the selection button and the external link as siblings.
- ❌ `<button role="row">` and nested `<button>` for Copy SHA in SVG commit table violated ARIA specifications.
  → 💡 Role "row" is only valid within table/grid roles, and nested buttons trigger invalid interactive descendant errors.
  → 🔧 Fixed by restructuring into accessible `<div role="region">` with `<ul role="list">` and `<li role="listitem">`, containing sibling interactive buttons.
