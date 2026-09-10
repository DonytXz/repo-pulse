import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ErrorDisplay } from '../components/ui/ErrorBoundary'
import { GitHubApiError } from '../api/client'

describe('ErrorDisplay', () => {
  it('renders generic error title and message with role="alert"', () => {
    const error = new Error('Failed to fetch data from repository')
    render(
      <ErrorDisplay
        error={error}
        onRetry={vi.fn()}
        onSwitchToDemo={vi.fn()}
        onOpenTokenModal={vi.fn()}
      />
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Unable to Load Repository Telemetry')).toBeInTheDocument()
    expect(screen.getByText('Failed to fetch data from repository')).toBeInTheDocument()
  })

  it('renders rate limit specific heading when error isRateLimit is true', () => {
    const error = new GitHubApiError('API rate limit exceeded', 403, true)
    render(
      <ErrorDisplay
        error={error}
        onRetry={vi.fn()}
        onSwitchToDemo={vi.fn()}
        onOpenTokenModal={vi.fn()}
      />
    )

    expect(screen.getByText('GitHub API Rate Limit Reached')).toBeInTheDocument()
  })

  it('invokes callback actions when action buttons are clicked', () => {
    const onRetry = vi.fn()
    const onSwitchToDemo = vi.fn()
    const onOpenTokenModal = vi.fn()

    render(
      <ErrorDisplay
        error={new Error('Network disconnected')}
        onRetry={onRetry}
        onSwitchToDemo={onSwitchToDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Explore Demo Snapshot/i }))
    expect(onSwitchToDemo).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /Add Free GitHub Token/i }))
    expect(onOpenTokenModal).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /Retry/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })
})
