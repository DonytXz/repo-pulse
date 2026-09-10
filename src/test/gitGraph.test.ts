import { describe, it, expect } from 'vitest'
import { computeGitGraph, generateRoutePath, DEFAULT_LAYOUT } from '../utils/gitGraph'
import type { CommitItem, BranchInfo } from '../api/types'

describe('Git DAG Layout Engine (gitGraph.ts)', () => {
  it('handles linear commit sequence in a single track', () => {
    const commits: CommitItem[] = [
      {
        sha: 'sha3',
        parents: [{ sha: 'sha2' }],
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-03' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-03' }, message: 'commit 3' },
        author: null,
      },
      {
        sha: 'sha2',
        parents: [{ sha: 'sha1' }],
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-02' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-02' }, message: 'commit 2' },
        author: null,
      },
      {
        sha: 'sha1',
        parents: [],
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-01' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-01' }, message: 'commit 1 (root)' },
        author: null,
      },
    ]

    const graph = computeGitGraph(commits)
    expect(graph).toHaveLength(3)

    // All commits should be on track 0
    expect(graph[0].trackIndex).toBe(0)
    expect(graph[1].trackIndex).toBe(0)
    expect(graph[2].trackIndex).toBe(0)

    // Routes
    expect(graph[0].routes).toEqual([{ fromTrack: 0, toTrack: 0, type: 'straight' }])
    expect(graph[1].routes).toEqual([{ fromTrack: 0, toTrack: 0, type: 'straight' }])
    expect(graph[2].routes).toEqual([]) // root commit has no routes
  })

  it('allocates secondary tracks for merge commits and creates merge routes', () => {
    const commits: CommitItem[] = [
      {
        sha: 'm1', // merge commit on main
        parents: [{ sha: 'c2' }, { sha: 'b1' }], // c2 on main, b1 on branch
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-04' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-04' }, message: 'Merge PR #1' },
        author: null,
      },
      {
        sha: 'b1', // commit on feature branch
        parents: [{ sha: 'c1' }],
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-03' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-03' }, message: 'feat: branch work' },
        author: null,
      },
      {
        sha: 'c2', // commit on main
        parents: [{ sha: 'c1' }],
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-02' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-02' }, message: 'fix on main' },
        author: null,
      },
      {
        sha: 'c1', // common ancestor
        parents: [],
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-01' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-01' }, message: 'initial' },
        author: null,
      },
    ]

    const graph = computeGitGraph(commits)
    expect(graph).toHaveLength(4)

    // Merge commit m1 is on track 0
    expect(graph[0].trackIndex).toBe(0)
    // Routes from m1: straight to track 0 (c2) and merge from track 1 (b1)
    expect(graph[0].routes).toEqual([
      { fromTrack: 0, toTrack: 0, type: 'straight' },
      { fromTrack: 1, toTrack: 0, type: 'merge' },
    ])

    // b1 is on track 1
    expect(graph[1].trackIndex).toBe(1)
  })

  it('maps branch and release tag badges to the correct commit nodes', () => {
    const commits: CommitItem[] = [
      {
        sha: 'sha_head',
        parents: [],
        commit: { author: { name: 'Dev', email: 'd@e.v', date: '2025-01-01' }, committer: { name: 'Dev', email: 'd@e.v', date: '2025-01-01' }, message: 'release' },
        author: null,
      },
    ]

    const branches: BranchInfo[] = [
      { name: 'main', commit: { sha: 'sha_head' }, protected: true },
    ]
    const tags = [
      { name: 'v1.0.0', commit: { sha: 'sha_head' } },
    ]

    const graph = computeGitGraph(commits, branches, tags)
    expect(graph[0].badges).toEqual([
      { name: 'main', type: 'head' },
      { name: 'v1.0.0', type: 'tag' },
    ])
  })

  it('generates correct SVG route paths for straight and curved connections', () => {
    // Straight line
    const straightPath = generateRoutePath(0, 0, 22, 66, DEFAULT_LAYOUT.laneWidth, 16)
    expect(straightPath).toBe('M 16 22 L 16 66')

    // Curved line from lane 1 to lane 0
    const curvedPath = generateRoutePath(1, 0, 22, 66, DEFAULT_LAYOUT.laneWidth, 16)
    expect(curvedPath).toContain('C')
    expect(curvedPath).toBe('M 34 22 C 34 44, 16 44, 16 66')
  })
})
