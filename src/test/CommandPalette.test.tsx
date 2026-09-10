import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CommandPalette } from '../components/ui/CommandPalette'

describe('CommandPalette', () => {
  const onClose = vi.fn()
  const onSelectRepo = vi.fn()
  const onSelectTab = vi.fn()
  const onToggleDemo = vi.fn()
  const onOpenTokenModal = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders dialog and search input when open', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/Search repositories or commands/i)).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <CommandPalette
        isOpen={false}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes when Escape is pressed', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('filters repositories when typing query', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    const input = screen.getByLabelText(/Search repositories or commands/i)
    fireEvent.change(input, { target: { value: 'react' } })

    expect(screen.getByText('facebook/react')).toBeInTheDocument()
    expect(screen.queryByText('angular/angular')).not.toBeInTheDocument()
  })

  it('selects repository and closes palette when clicking repo option', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    const reactOption = screen.getByText('facebook/react')
    fireEvent.click(reactOption)

    expect(onSelectRepo).toHaveBeenCalledWith('facebook/react', false)
    expect(onClose).toHaveBeenCalled()
  })

  it('supports custom URL or repository entry on form submit', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    const input = screen.getByLabelText(/Search repositories or commands/i)
    fireEvent.change(input, { target: { value: 'https://github.com/DonytXz/Pokedex-React' } })
    fireEvent.submit(input.closest('form')!)

    expect(onSelectRepo).toHaveBeenCalledWith('DonytXz/Pokedex-React', false)
    expect(onClose).toHaveBeenCalled()
  })

  it('triggers view navigation tab changes', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    const networkTab = screen.getByRole('button', { name: /Contributor Network/i })
    fireEvent.click(networkTab)

    expect(onSelectTab).toHaveBeenCalledWith('network')
    expect(onClose).toHaveBeenCalled()
  })

  it('triggers quick actions for demo mode and token modal', () => {
    render(
      <CommandPalette
        isOpen={true}
        onClose={onClose}
        onSelectRepo={onSelectRepo}
        onSelectTab={onSelectTab}
        onToggleDemo={onToggleDemo}
        onOpenTokenModal={onOpenTokenModal}
      />
    )

    const demoBtn = screen.getByRole('button', { name: /Toggle Offline Demo Snapshot Mode/i })
    fireEvent.click(demoBtn)
    expect(onToggleDemo).toHaveBeenCalled()
    expect(onClose).toHaveBeenCalled()
  })
})
