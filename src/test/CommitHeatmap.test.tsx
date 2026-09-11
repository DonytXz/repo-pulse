import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CommitHeatmap } from '../components/charts/CommitHeatmap'
import { ThemeProvider } from '../context/ThemeContext'

vi.mock('echarts-for-react', () => ({
  default: () => <div data-testid="echarts-heatmap">Heatmap Canvas</div>,
}))

const renderWithTheme = (ui: React.ReactElement) => render(ui, { wrapper: ThemeProvider })

const mockData: Array<[string, number]> = [
  ['2023-05-10', 5],
  ['2023-11-20', 12],
  ['2024-01-15', 3],
  ['2024-06-22', 8],
]

describe('CommitHeatmap', () => {
  it('renders commit statistics and region container', () => {
    renderWithTheme(<CommitHeatmap data={mockData} />)

    expect(screen.getByText('Commit Activity Heatmap')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /Commit activity calendar heatmap/i })).toBeInTheDocument()
  })

  it('extracts distinct years into selectable timeframe pills', () => {
    renderWithTheme(<CommitHeatmap data={mockData} />)

    const recentBtn = screen.getByRole('button', { name: /Recent \(12M\)/i })
    const year2024Btn = screen.getByRole('button', { name: '2024' })
    const year2023Btn = screen.getByRole('button', { name: '2023' })

    expect(recentBtn).toBeInTheDocument()
    expect(year2024Btn).toBeInTheDocument()
    expect(year2023Btn).toBeInTheDocument()
    expect(recentBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('updates selected timeframe pill on click and recalculates period counts', () => {
    renderWithTheme(<CommitHeatmap data={mockData} />)

    const year2023Btn = screen.getByRole('button', { name: '2023' })
    fireEvent.click(year2023Btn)

    expect(year2023Btn).toHaveAttribute('aria-pressed', 'true')
    // 2023 has 5 + 12 = 17 commits
    expect(screen.getByText('17')).toBeInTheDocument()
    expect(screen.getByText(/commits in selected period/i)).toBeInTheDocument()
  })
})
