import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import { CommitDetailDrawer } from '../components/dashboard/CommitDetailDrawer'
import { MOCK_COMMIT_DETAIL } from '../api/mockData'

describe('CommitDetailDrawer', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
  })

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <CommitDetailDrawer
          isOpen={false}
          commitSha={null}
          repo="facebook/react"
          onClose={vi.fn()}
        />
      </QueryClientProvider>
    )

    expect(container.firstChild).toBeNull()
  })

  it('renders commit details when open in demo mode', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CommitDetailDrawer
          isOpen={true}
          commitSha="c_merge_01"
          repo="facebook/react"
          isDemo={true}
          onClose={vi.fn()}
        />
      </QueryClientProvider>
    )

    // Wait for drawer content
    expect(await screen.findByText(/Enable memoization passes/i)).toBeInTheDocument()
    expect(screen.getByText(MOCK_COMMIT_DETAIL.commit.author.name)).toBeInTheDocument()
    expect(screen.getByText('Verified')).toBeInTheDocument()
    expect(screen.getByText(String(MOCK_COMMIT_DETAIL.stats.additions))).toBeInTheDocument()
    expect(screen.getByText(String(MOCK_COMMIT_DETAIL.stats.deletions))).toBeInTheDocument()
    expect(screen.getByText('packages/react-compiler/src/index.ts')).toBeInTheDocument()
  })

  it('triggers onClose when close button is clicked', async () => {
    const handleClose = vi.fn()
    render(
      <QueryClientProvider client={queryClient}>
        <CommitDetailDrawer
          isOpen={true}
          commitSha="c_merge_01"
          repo="facebook/react"
          isDemo={true}
          onClose={handleClose}
        />
      </QueryClientProvider>
    )

    const closeBtn = await screen.findByRole('button', { name: /Close commit details/i })
    fireEvent.click(closeBtn)

    expect(handleClose).toHaveBeenCalled()
  })

  it('triggers onClose when Escape key is pressed', async () => {
    const handleClose = vi.fn()
    render(
      <QueryClientProvider client={queryClient}>
        <CommitDetailDrawer
          isOpen={true}
          commitSha="c_merge_01"
          repo="facebook/react"
          isDemo={true}
          onClose={handleClose}
        />
      </QueryClientProvider>
    )

    await screen.findByText(/Enable memoization passes/i)
    fireEvent.keyDown(window, { key: 'Escape' })

    expect(handleClose).toHaveBeenCalled()
  })

  it('allows copying full commit SHA to clipboard', async () => {
    const writeTextMock = vi.fn()
    Object.assign(navigator, {
      clipboard: {
        writeText: writeTextMock,
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <CommitDetailDrawer
          isOpen={true}
          commitSha="c_merge_01"
          repo="facebook/react"
          isDemo={true}
          onClose={vi.fn()}
        />
      </QueryClientProvider>
    )

    const copyBtn = await screen.findByRole('button', { name: /Copy full commit SHA/i })
    fireEvent.click(copyBtn)

    expect(writeTextMock).toHaveBeenCalledWith('c_merge_01')
  })
})
