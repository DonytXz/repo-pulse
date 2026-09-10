import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@testing-library/jest-dom'
import App from '../App'

// Mock echarts-for-react to prevent canvas rendering errors in jsdom
vi.mock('echarts-for-react', () => {
  return {
    default: () => <div data-testid="echarts-mock">Chart Rendered</div>,
  }
})

describe('App Integration', () => {
  let queryClient: QueryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })
    window.history.pushState(null, '', '/?demo=true')
  })

  it('renders dashboard with demo repository telemetry', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )

    // Verify brand and repo name
    expect(screen.getAllByText('RepoPulse').length).toBeGreaterThan(0)
    expect(await screen.findByText('facebook/react')).toBeInTheDocument()

    // Verify telemetry metrics cards
    expect(screen.getByText('Ecosystem Health')).toBeInTheDocument()
    expect(screen.getByText('Bus Factor Resilience')).toBeInTheDocument()
    expect(screen.getByText('PR Velocity Turnaround')).toBeInTheDocument()
    expect(screen.getByText('Issue Resolution Cadence')).toBeInTheDocument()

    // Verify Top Core Contributors section
    expect(screen.getByText('Top Core Contributors')).toBeInTheDocument()
  })

  it('renders command palette trigger button and key shortcut info', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    )

    expect(screen.getByTitle('Open Command Palette (Cmd+K)')).toBeInTheDocument()
  })
})
