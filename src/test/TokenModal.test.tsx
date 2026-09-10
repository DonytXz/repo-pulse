import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { TokenModal } from '../components/layout/TokenModal'
import * as apiClient from '../api/client'

vi.mock('../api/client', () => ({
  getStoredToken: vi.fn(),
  setStoredToken: vi.fn(),
  checkRateLimit: vi.fn(),
}))

describe('TokenModal', () => {
  const onClose = vi.fn()
  const onTokenUpdated = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(apiClient.getStoredToken).mockReturnValue(null)
    vi.mocked(apiClient.checkRateLimit).mockResolvedValue({
      limit: 5000,
      remaining: 4999,
      reset: Date.now() + 3600000,
      used: 1,
    })
  })

  it('renders dialog when isOpen is true', () => {
    render(<TokenModal isOpen={true} onClose={onClose} onTokenUpdated={onTokenUpdated} />)

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('GitHub API Personal Access Token')).toBeInTheDocument()
    expect(screen.getByLabelText(/GitHub Token/i)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<TokenModal isOpen={false} onClose={onClose} onTokenUpdated={onTokenUpdated} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when Escape key is pressed', () => {
    render(<TokenModal isOpen={true} onClose={onClose} onTokenUpdated={onTokenUpdated} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('saves token and updates rate limit state successfully', async () => {
    render(<TokenModal isOpen={true} onClose={onClose} onTokenUpdated={onTokenUpdated} />)

    const input = screen.getByLabelText(/GitHub Token/i)
    fireEvent.change(input, { target: { value: 'ghp_testtoken123456789' } })

    const submitBtn = screen.getByRole('button', { name: /Save & Verify/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(apiClient.setStoredToken).toHaveBeenCalledWith('ghp_testtoken123456789')
      expect(apiClient.checkRateLimit).toHaveBeenCalled()
      expect(onTokenUpdated).toHaveBeenCalled()
      expect(screen.getByText(/Token authenticated successfully/i)).toBeInTheDocument()
    })
  })

  it('handles verification error gracefully', async () => {
    vi.mocked(apiClient.checkRateLimit).mockRejectedValueOnce(new Error('Unauthorized'))

    render(<TokenModal isOpen={true} onClose={onClose} onTokenUpdated={onTokenUpdated} />)

    const input = screen.getByLabelText(/GitHub Token/i)
    fireEvent.change(input, { target: { value: 'invalid_token' } })

    const submitBtn = screen.getByRole('button', { name: /Save & Verify/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(screen.getByText(/Failed to authenticate token with GitHub API/i)).toBeInTheDocument()
    })
  })

  it('allows clearing an existing token', async () => {
    vi.mocked(apiClient.getStoredToken).mockReturnValue('ghp_existing_token')

    render(<TokenModal isOpen={true} onClose={onClose} onTokenUpdated={onTokenUpdated} />)

    const removeBtn = screen.getByRole('button', { name: /Remove Token/i })
    expect(removeBtn).toBeInTheDocument()

    fireEvent.click(removeBtn)

    await waitFor(() => {
      expect(apiClient.setStoredToken).toHaveBeenCalledWith(null)
      expect(screen.getByText(/Token cleared from session storage/i)).toBeInTheDocument()
      expect(onTokenUpdated).toHaveBeenCalled()
    })
  })
})
