# Continuity — Working Memory

## Aktueller Task
- **Projekt:** RepoPulse (Open-Source Ecosystem Intelligence & Contributor Network)
- **Status:** Done / Stable & Live
- **Aktives Gate:** 5-VERIFY (Abgeschlossen & Deployed)
- **Letzte Aktualisierung:** 2026-09-10

## Letzter Stand & Erledigte Schritte
- [x] Scaffolding: React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + ECharts
- [x] Resilient GitHub API Client with rate-limit tracking, header inspection, and sessionStorage PAT modal
- [x] Pre-bundled offline demo snapshot (`facebook/react`)
- [x] Interactive ECharts Force-Directed Contributor Network Graph
- [x] Commit Frequency Heatmap with multi-year scaling and year filter pills (`Recent (12M)`, `2024`, `2023`, etc.)
- [x] PR Velocity and Issue Burndown charts with zoom sliders
- [x] Repository Health Score and Bus Factor calculation
- [x] Deep URL parameter synchronization (`?repo=...&tab=...&user=...`)
- [x] Support full GitHub URLs pasting with automatic normalization (`DonytXz/Pokedex-React`)
- [x] Automated test suite: 24/24 tests passing (`vitest`)
- [x] Static build clean & zero lint errors (`oxlint`)
- [x] Deployed live to GitHub Pages: https://donatoalvarez.dev/repo-pulse/
- [x] Synchronized `.agent/` configuration and `AGENTS.md`

## Betroffene Dateien
| Datei | Zweck |
|---|---|
| `AGENTS.md` | Shared Agent Configuration & Quality Gates |
| `.agent/rules/*` | System rules (continuity, git, testing, security, etc.) |
| `.agent/skills/*` | Modular skills library |
| `.agent/workflows/*` | OpenSpec workflows |
| `.agent/CONTINUITY.md` | Working memory and status tracker |

## ⚠️ Mistakes & Learnings
- ❌ ECharts calendar heatmap tried to fit 4.5 years in a single row for multi-year repos.
  → 💡 Unconstrained date ranges break calendar cell aspect ratios.
  → 🔧 Fixed by constraining views to max 1-year (52 weeks) with year selector pills.
