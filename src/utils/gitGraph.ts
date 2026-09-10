import type { CommitItem, BranchInfo, GraphCommit, GraphRoute, GraphBadge } from '../api/types'

export const TRACK_PALETTE = [
  '#06b6d4', // cyan-500
  '#8b5cf6', // purple-500
  '#f59e0b', // amber-500
  '#10b981', // emerald-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
  '#f43f5e', // rose-500
  '#a855f7', // violet-500
]

export interface LayoutOptions {
  rowHeight?: number
  laneWidth?: number
  nodeRadius?: number
}

export const DEFAULT_LAYOUT: Required<LayoutOptions> = {
  rowHeight: 44,
  laneWidth: 18,
  nodeRadius: 4.5,
}

/**
 * Topologically allocates vertical subway tracks and routes for Git DAG commits
 */
export function computeGitGraph(
  commits: CommitItem[],
  branches: BranchInfo[] = [],
  tags: Array<{ name: string; commit: { sha: string } }> = []
): GraphCommit[] {
  if (!commits || commits.length === 0) return []

  // Map of sha -> badges
  const badgeMap = new Map<string, GraphBadge[]>()
  branches.forEach((b) => {
    if (!b?.commit?.sha) return
    const list = badgeMap.get(b.commit.sha) || []
    list.push({
      name: b.name,
      type: b.name === 'main' || b.name === 'master' ? 'head' : 'branch',
    })
    badgeMap.set(b.commit.sha, list)
  })
  tags.forEach((t) => {
    if (!t?.commit?.sha) return
    const list = badgeMap.get(t.commit.sha) || []
    list.push({ name: t.name, type: 'tag' })
    badgeMap.set(t.commit.sha, list)
  })

  // Active tracks array: activeTracks[laneIndex] = sha of commit expected in this track
  const activeTracks: (string | null)[] = []
  const graphCommits: GraphCommit[] = []

  for (let i = 0; i < commits.length; i++) {
    const commit = commits[i]
    const parents = commit.parents?.map((p) => p.sha) || []

    // 1. Determine which track this commit belongs to
    let trackIndex = activeTracks.indexOf(commit.sha)
    if (trackIndex === -1) {
      // Find the first available empty slot or append new lane
      const emptySlot = activeTracks.indexOf(null)
      trackIndex = emptySlot !== -1 ? emptySlot : activeTracks.length
    }

    // 2. Commit reached its lane, clear this reservation
    activeTracks[trackIndex] = null

    // 3. Compute routes to parent commits
    const routes: GraphRoute[] = []

    if (parents.length === 0) {
      // Root commit (no parents)
    } else if (parents.length === 1) {
      // Linear commit: primary parent continues on the same track
      const parentSha = parents[0]
      activeTracks[trackIndex] = parentSha
      routes.push({
        fromTrack: trackIndex,
        toTrack: trackIndex,
        type: 'straight',
      })
    } else {
      // Merge commit (2+ parents)
      // Primary parent (target branch) continues on the same track
      const primaryParent = parents[0]
      activeTracks[trackIndex] = primaryParent
      routes.push({
        fromTrack: trackIndex,
        toTrack: trackIndex,
        type: 'straight',
      })

      // Secondary parents (incoming merge branches)
      for (let pIdx = 1; pIdx < parents.length; pIdx++) {
        const mergeParent = parents[pIdx]
        let mergeTrack = activeTracks.indexOf(mergeParent)
        if (mergeTrack === -1) {
          const emptySlot = activeTracks.indexOf(null)
          mergeTrack = emptySlot !== -1 ? emptySlot : activeTracks.length
          activeTracks[mergeTrack] = mergeParent
        }
        routes.push({
          fromTrack: mergeTrack,
          toTrack: trackIndex,
          type: 'merge',
        })
      }
    }

    const color = TRACK_PALETTE[trackIndex % TRACK_PALETTE.length]
    const badges = badgeMap.get(commit.sha) || []

    graphCommits.push({
      ...commit,
      trackIndex,
      color,
      routes,
      badges,
    })
  }

  return graphCommits
}

/**
 * Generate smooth SVG path string for a route between tracks
 */
export function generateRoutePath(
  fromTrack: number,
  toTrack: number,
  fromY: number,
  toY: number,
  laneWidth: number = DEFAULT_LAYOUT.laneWidth,
  originX: number = 16
): string {
  const x1 = originX + fromTrack * laneWidth
  const y1 = fromY
  const x2 = originX + toTrack * laneWidth
  const y2 = toY

  if (x1 === x2) {
    return `M ${x1} ${y1} L ${x2} ${y2}`
  }

  // Smooth cubic bezier curve for branching/merging
  const yMid = (y1 + y2) / 2
  return `M ${x1} ${y1} C ${x1} ${yMid}, ${x2} ${yMid}, ${x2} ${y2}`
}
