import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContributorLeaderboard } from '../components/dashboard/ContributorLeaderboard'
import type { Contributor } from '../api/types'

const mockContributors: Contributor[] = [
  {
    login: 'gaearon',
    id: 1,
    avatar_url: 'https://avatars.githubusercontent.com/u/810438?v=4',
    html_url: 'https://github.com/gaearon',
    contributions: 1650,
    role: 'Top Maintainer',
    commitShare: 45.2,
  },
  {
    login: 'sophiebits',
    id: 2,
    avatar_url: 'https://avatars.githubusercontent.com/u/985197?v=4',
    html_url: 'https://github.com/sophiebits',
    contributions: 1210,
    role: 'Core Contributor',
    commitShare: 33.1,
  },
  {
    login: 'sebmarkbage',
    id: 3,
    avatar_url: 'https://avatars.githubusercontent.com/u/63648?v=4',
    html_url: 'https://github.com/sebmarkbage',
    contributions: 800,
    role: 'Regular Contributor',
    commitShare: 21.7,
  },
]

describe('ContributorLeaderboard', () => {
  it('renders contributors with rank, contributions, and share percentage', () => {
    render(
      <ContributorLeaderboard
        contributors={mockContributors}
        onSelectUser={vi.fn()}
      />
    )

    expect(screen.getByText('Top Core Contributors')).toBeInTheDocument()
    expect(screen.getByText('gaearon')).toBeInTheDocument()
    expect(screen.getByText('sophiebits')).toBeInTheDocument()
    expect(screen.getByText('sebmarkbage')).toBeInTheDocument()
    expect(screen.getByText('1,650')).toBeInTheDocument()
    expect(screen.getByText(/45% share/i)).toBeInTheDocument()
  })

  it('handles contributor selection via click', () => {
    const onSelectUser = vi.fn()
    render(
      <ContributorLeaderboard
        contributors={mockContributors}
        onSelectUser={onSelectUser}
      />
    )

    const button = screen.getByRole('button', { name: /gaearon/i })
    fireEvent.click(button)

    expect(onSelectUser).toHaveBeenCalledWith('gaearon')
  })

  it('indicates aria-pressed state when highlightedUser is active', () => {
    render(
      <ContributorLeaderboard
        contributors={mockContributors}
        highlightedUser="gaearon"
        onSelectUser={vi.fn()}
      />
    )

    const gaearonBtn = screen.getByRole('button', { name: /gaearon/i })
    const sophieBtn = screen.getByRole('button', { name: /sophiebits/i })

    expect(gaearonBtn).toHaveAttribute('aria-pressed', 'true')
    expect(sophieBtn).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders accessible external links to GitHub profiles', () => {
    render(
      <ContributorLeaderboard
        contributors={mockContributors}
        onSelectUser={vi.fn()}
      />
    )

    const link = screen.getByLabelText("View gaearon's profile on GitHub")
    expect(link).toHaveAttribute('href', 'https://github.com/gaearon')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})
