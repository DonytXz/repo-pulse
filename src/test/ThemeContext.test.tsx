import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider, useTheme } from '../context/ThemeContext'

// Test helper component
const ThemeConsumer = () => {
  const { theme, toggleTheme, setTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button type="button" onClick={toggleTheme} data-testid="toggle-btn">
        Toggle
      </button>
      <button type="button" onClick={() => setTheme('dark')} data-testid="set-dark-btn">
        Set Dark
      </button>
      <button type="button" onClick={() => setTheme('light')} data-testid="set-light-btn">
        Set Light
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.style.colorScheme = ''
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.style.colorScheme = ''
  })

  it('defaults to light theme when no saved preference exists in localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('loads dark theme if localStorage has repopulse-theme = dark', () => {
    localStorage.setItem('repopulse-theme', 'dark')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('toggles from light to dark, updates documentElement class, and persists to localStorage', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')

    act(() => {
      fireEvent.click(screen.getByTestId('toggle-btn'))
    })

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(localStorage.getItem('repopulse-theme')).toBe('dark')

    // Toggle back to light
    act(() => {
      fireEvent.click(screen.getByTestId('toggle-btn'))
    })

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(document.documentElement.style.colorScheme).toBe('light')
    expect(localStorage.getItem('repopulse-theme')).toBe('light')
  })

  it('explicitly sets theme using setTheme', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    act(() => {
      fireEvent.click(screen.getByTestId('set-dark-btn'))
    })

    expect(screen.getByTestId('theme-value')).toHaveTextContent('dark')
    expect(localStorage.getItem('repopulse-theme')).toBe('dark')

    act(() => {
      fireEvent.click(screen.getByTestId('set-light-btn'))
    })

    expect(screen.getByTestId('theme-value')).toHaveTextContent('light')
    expect(localStorage.getItem('repopulse-theme')).toBe('light')
  })

  it('throws error when useTheme is consumed outside ThemeProvider', () => {
    const BadConsumer = () => {
      useTheme()
      return <div>Bad</div>
    }

    expect(() => render(<BadConsumer />)).toThrow('useTheme must be used within a ThemeProvider')
  })
})
