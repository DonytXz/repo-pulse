import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CommitGraph } from '../components/charts/CommitGraph'
import { ThemeProvider } from '../context/ThemeContext'
import { MOCK_COMMITS, MOCK_BRANCHES } from '../api/mockData'

const renderWithTheme = (ui: React.ReactElement) => render(ui, { wrapper: ThemeProvider })

describe('CommitGraph', () => {
  it('renders commit history explorer with commits count', () => {
    renderWithTheme(
      <CommitGraph
        commits={MOCK_COMMITS}
        branches={MOCK_BRANCHES}
        onSelectCommit={vi.fn()}
      />
    )

    expect(screen.getByText('Commit History Graph')).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`${MOCK_COMMITS.length} of ${MOCK_COMMITS.length} commits`, 'i'))).toBeInTheDocument()
  })

  it('renders branch badges and commit messages', () => {
    renderWithTheme(
      <CommitGraph
        commits={MOCK_COMMITS}
        branches={MOCK_BRANCHES}
        onSelectCommit={vi.fn()}
      />
    )

    // Check presence of branch badges
    expect(screen.getByText('main')).toBeInTheDocument()
    // Check presence of commit messages from mock
    expect(screen.getByText(/Merge pull request #31050 from facebook\/feat\/compiler/i)).toBeInTheDocument()
  })

  it('filters commits by message or author via search query input', () => {
    renderWithTheme(
      <CommitGraph
        commits={MOCK_COMMITS}
        branches={MOCK_BRANCHES}
        onSelectCommit={vi.fn()}
      />
    )

    const searchInput = screen.getByPlaceholderText(/Filter commits by message/i)
    fireEvent.change(searchInput, { target: { value: 'compiler' } })

    expect(screen.getByText(/Merge pull request #31050 from facebook\/feat\/compiler/i)).toBeInTheDocument()
    expect(screen.queryByText(/hydrate nested Suspense/i)).not.toBeInTheDocument()
  })

  it('triggers onSelectCommit callback when a commit row is clicked', () => {
    const handleSelect = vi.fn()
    renderWithTheme(
      <CommitGraph
        commits={MOCK_COMMITS}
        branches={MOCK_BRANCHES}
        onSelectCommit={handleSelect}
      />
    )

    const firstCommitRow = screen.getAllByRole('button', {
      name: /Commit c_merge/i,
    })[0]
    fireEvent.click(firstCommitRow)

    expect(handleSelect).toHaveBeenCalledWith('c_merge_01')
  })

  it('handles keyboard navigation with arrow keys and Enter', () => {
    const handleSelect = vi.fn()
    renderWithTheme(
      <CommitGraph
        commits={MOCK_COMMITS}
        branches={MOCK_BRANCHES}
        onSelectCommit={handleSelect}
      />
    )

    const firstRow = screen.getAllByRole('button', {
      name: /Commit c_merge/i,
    })[0]

    fireEvent.keyDown(firstRow, { key: 'ArrowDown' })
    fireEvent.keyDown(firstRow, { key: 'Enter' })

    expect(handleSelect).toHaveBeenCalledWith('c_merge_01')
  })
})
