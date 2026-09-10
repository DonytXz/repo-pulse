# ⚡ RepoPulse — Open-Source Ecosystem Intelligence & Contributor Network

[![Live Demo](https://img.shields.io/badge/Live_Demo-donatoalvarez.dev%2Frepo--pulse-emerald.svg)](https://donatoalvarez.dev/repo-pulse/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0_Strict-blue.svg)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Zero Backend](https://img.shields.io/badge/Backend-100%25_Client--Side-emerald.svg)](#zero-vps-architecture)

> **Live Demo:** [https://donatoalvarez.dev/repo-pulse/](https://donatoalvarez.dev/repo-pulse/)
>
> **RepoPulse** is an in-browser analytics and telemetry platform for open-source repositories. It runs **100% client-side**, consumes GitHub's public API directly from the browser.

---

## 🎯 Executive Summary & Case Study

### The Problem
Engineering leaders, open-source maintainers, and developer advocates need deep visibility into repository health, maintainer burnout risks, contributor community clusters, and PR turnaround velocity. Furthermore, developers inspecting open-source projects frequently struggle to understand complex branch forks, PR merges, release histories, and commit lineage without installing heavy desktop Git GUI clients like SourceTree or GitKraken. Traditional web dashboards either require heavyweight backend servers and database migrations, or provide only flat, linear commit logs devoid of branch topology.

### The Solution: 100% Client-Side Intelligence & Git Topology
RepoPulse demonstrates that complex data telemetry, community graph clustering, time-series heatmaps, and **topological Git DAG commit history graphs** can execute smoothly directly inside the browser sandbox without a backend:
1. **SourceTree / GitKraken-Style Commit DAG Graph**: Renders an interactive multi-lane subway/railway graph mapping branch splits, merge junctions, and topological commit lineage using sharp vector SVG curves.
2. **Commit Diff & Inspection Drawer**: Deep inspection of changed files, addition/deletion line metrics, author PGP signatures, and commit messages on demand.
3. **Force-Directed Contributor Network**: Computes dynamic collaboration graphs with weighted edges, physics simulation, and community clustering based on commit co-authorship and PR reviews.
4. **Commit Frequency Heatmap**: Visualizes commit cadence across days, weeks, and multi-year timeframes with responsive timeframe selector pills.
5. **PR Velocity & Issue Burndown**: Dual-series charts tracking lead time to merge, backlog intake, and resolution velocity with interactive zoom scrubbers.
6. **Deep URL Synchronization**: All repository parameters, active tabs, and highlighted contributor states serialize directly to URL search params (`?repo=...&tab=...&user=...`), allowing 1-click reproducible sharing.
7. **Rate-Limit Resilience & Zero Friction**: Includes proactive header quota meters, backoff guardrails, optional client-side PAT input stored exclusively in `sessionStorage`, and pre-bundled **Demo Snapshots** (`facebook/react`) for instant exploration without consuming API calls.

---

## 🏛️ Architecture & Data Flow

```mermaid
flowchart TD
    subgraph Browser["Browser Client Runtime (100% Static Client-Side)"]
        User["User / Interviewer"] -->|Search / Query Param| Router["URL State Synchronizer\n(window.location.search)"]
        Router --> UI["Dashboard UI Orchestrator\n(React 19 + Tailwind CSS v4)"]

        UI --> Hook["Telemetry & History Engine\n(useRepoData + TanStack Query)"]

        Hook -->|If Demo Mode| Fixture["Pre-bundled Offline Snapshot\n(facebook/react DAG + Metrics)"]
        Hook -->|If Live Mode| Client["Resilient GitHub Client\n(Headers & Quota Interceptor)"]

        Client --> Metrics["Metrics & DAG Computation Utility"]
        Fixture --> Metrics

        Metrics --> Graph["Network Graph (Force Clustering)"]
        Metrics --> Heatmap["Commit Heatmap (Calendar Series)"]
        Metrics --> Velocity["PR Velocity & Issue Burndown"]
        Metrics --> Health["Health Score & Bus Factor Risk"]
        Metrics --> DAG["Git DAG Engine (Subway Track Allocator)"]

        Graph --> Charts["Apache ECharts Engine\n(60 FPS Canvas Rendering)"]
        Heatmap --> Charts
        Velocity --> Charts

        DAG --> SVGGraph["Custom SVG DAG Renderer\n(Cubic Bezier Curves & Rails)"]
        SVGGraph --> Drawer["Commit Inspection Drawer\n(File Diffs & Line Stats)"]

        Charts --> UI
        SVGGraph --> UI
        Drawer --> UI
    end

    subgraph GitHubAPI["GitHub Public Cloud API"]
        Client -->|REST endpoints + Rate limit headers| API["api.github.com\n(/repos, /commits, /pulls, /issues, /branches)"]
        PAT["sessionStorage PAT\n(Elevates to 5,000 reqs/hr)"] -.-> Client
    end
```

---

## ⚖️ Technical Decisions & Trade-Offs

| Decision | Alternative Evaluated | Why This Choice Won |
|---|---|---|
| **Custom SVG Git DAG Engine** | `gitgraph.js` / HTML5 Canvas | Delivers crisp vector lines on Retina displays, ~6 KB bundle overhead (zero external library bloat), full WCAG 2.1 AA accessibility (keyboard focusable nodes), native Tailwind styling, and React 19 compatibility. |
| **Apache ECharts (Canvas)** | D3.js (SVG) / Chart.js | Renders complex force-directed physics graphs with hundreds of nodes and thousands of data points at **60 FPS** without DOM bloating or SVG layout thrashing. |
| **TanStack Query v5** | Ad-hoc `useEffect` + `fetch` | Automatic request deduplication, optimistic caching with 10-minute stale windows, background garbage collection, and custom retry policies preventing API hammering. |
| **`sessionStorage` for PAT** | `localStorage` / Cookies | Strict client isolation: tokens are never persisted across browser restarts and never sent to any server other than directly to `api.github.com`. |
| **Deep URL Parameter Sync** | Internal React State / Redux | Allows instant link sharing and restores exact filter contexts via native browser `popstate` and `pushState` events. |
| **Pre-Bundled Offline Snapshots** | Requiring Mandatory Tokens | Reviewers and hiring managers can explore rich data immediately even if unauthenticated public rate limits (60/hr) are saturated. |

---

## 🚀 Key Features & Scope

### 📊 Ecosystem Intelligence & Health
* **Repository Health Score (0-100)**: Composite index factoring in contributor diversity, PR turnaround velocity, and backlog resolution rate.
* **Bus Factor Risk Metric**: Calculates the minimum number of core contributors who account for $\ge 50\%$ of overall commits.
* **Community Clustering**: Categorizes contributors into Core Maintainers, Frequent Collaborators, Active Contributors, and Community tiers.
* **PR Velocity & Issue Burndown**: Visualizes monthly pull request turnaround times and issue backlog clearance cadence.
* **Commit Activity Heatmap**: Responsive multi-year calendar grid with timeframe selection pills (`Recent 12M`, `2024`, `2023`, etc.).

### 🌿 Visual Git DAG & Commit Topology (Expanded Scope)
* **SourceTree / GitKraken-Style Subway Graph**: Multi-lane visual branch graph rendering forks, merges, and commit sequence via smooth cubic bezier connectors.
* **Branch & Release Tag Badges**: Identifies branch tips (`main`, `HEAD`) and release versions (`v19.0.0`) on graph nodes.
* **Commit Inspection Drawer**: Slide-out panel displaying full commit messages, author PGP verification, changed file lists, and diff stats (`+additions` / `-deletions`).
* **Live Commit Filter**: Search commits by message keywords, author login, or SHA.

### ⚡ Developer Experience & Accessibility
* **WCAG 2.1 AA Compliant**: Skip-to-main-content navigation, accessible modal focus traps with `Escape` dismiss, aria tablists, progressbars, and 0 axe violations.
* **Accessible Command Palette (`Cmd + K`)**: Instant keyboard navigation, flagship repository switcher (`facebook/react`, `angular/angular`, `vitejs/vite`, `torvalds/linux`, etc.), and view jumping.
* **Proactive API Quota Badge**: Real-time visualization of remaining API calls, countdown until reset, and rate limit status alerts.
* **Code-Split Architecture**: Dynamic `React.lazy()` bundling keeping initial page load under **~94 kB gzipped**.

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js `v20+` or `v24+`
- npm `10+`

### Installation & Development
```bash
# Clone the repository
git clone https://github.com/dalvarez/repo-pulse.git
cd repo-pulse

# Install dependencies
npm install

# Start development server with instant HMR
npm run dev
```

### Automated Testing & Linting
```bash
# Run unit & integration test suites (Vitest)
npm run test

# Run Oxlint static analysis
npm run lint

# Build static production bundle for GitHub Pages
npm run build
```

---

## 🚢 Deployment to GitHub Pages

The repository contains an automated GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. Runs code quality checks (`npm run lint`).
2. Executes test suite (`npm run test`).
3. Compiles the static production bundle (`npm run build`).
4. Deploys the `./dist` folder directly to GitHub Pages.

To enable GitHub Pages in your repository:
1. Go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. Push to `main` — deployment will trigger automatically.

---

## 🗺️ Scope & Product Roadmap

```text
Phase 1: Open-Source Ecosystem Intelligence (Complete)
├── 100% Client-Side Architecture & Zero VPS Infrastructure
├── Force-Directed Contributor Collaboration Network (ECharts)
├── Dynamic Bus Factor Resilience & Ecosystem Health Index (0-100)
├── Multi-Year Commit Activity Heatmap & Timeframe Scrubbing
├── PR Velocity & Issue Burndown Dual-Series Analysis
└── WCAG 2.1 AA Accessibility & Automated Axe Audit

Phase 2: Visual Git Topology & DAG History (Scope Expansion - Active)
├── Topological Git DAG Subway Engine (Lane & Route Allocation)
├── Multi-Track Vector SVG Graph (Cubic Bezier Forks & Merges)
├── Branch & Release Tag Resolution (HEAD, main, SemVer tags)
├── Interactive Commit Inspection Drawer (File Diffs, +/-, Author Signatures)
└── Offline Demo Branch Topology Fixtures for 1-Click Zero-API Exploration
```

---

## 📄 License

Distributed under the [MIT License](LICENSE).
