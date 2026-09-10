import { describe, it, expect } from 'vitest'
import { normalizeRepoInput, isValidRepoFormat } from '../utils/repoParser'

describe('Repository URL and Input Parser', () => {
  it('parses full HTTPS GitHub URLs', () => {
    expect(normalizeRepoInput('https://github.com/DonytXz/Pokedex-React')).toBe('DonytXz/Pokedex-React')
  })

  it('parses HTTP and www URLs', () => {
    expect(normalizeRepoInput('http://www.github.com/DonytXz/Pokedex-React')).toBe('DonytXz/Pokedex-React')
  })

  it('parses domain-only URLs without protocol', () => {
    expect(normalizeRepoInput('github.com/DonytXz/Pokedex-React')).toBe('DonytXz/Pokedex-React')
  })

  it('handles trailing slashes', () => {
    expect(normalizeRepoInput('https://github.com/DonytXz/Pokedex-React/')).toBe('DonytXz/Pokedex-React')
  })

  it('handles .git suffix', () => {
    expect(normalizeRepoInput('https://github.com/DonytXz/Pokedex-React.git')).toBe('DonytXz/Pokedex-React')
  })

  it('handles SSH git clone URLs', () => {
    expect(normalizeRepoInput('git@github.com:DonytXz/Pokedex-React.git')).toBe('DonytXz/Pokedex-React')
  })

  it('extracts owner and repo from deep sub-paths', () => {
    expect(normalizeRepoInput('https://github.com/DonytXz/Pokedex-React/tree/main/src')).toBe('DonytXz/Pokedex-React')
    expect(normalizeRepoInput('https://github.com/DonytXz/Pokedex-React/pull/42')).toBe('DonytXz/Pokedex-React')
  })

  it('leaves standard owner/repo format unchanged', () => {
    expect(normalizeRepoInput('DonytXz/Pokedex-React')).toBe('DonytXz/Pokedex-React')
    expect(normalizeRepoInput(' facebook/react ')).toBe('facebook/react')
  })

  it('validates repository format correctly', () => {
    expect(isValidRepoFormat('https://github.com/DonytXz/Pokedex-React')).toBe(true)
    expect(isValidRepoFormat('DonytXz/Pokedex-React')).toBe(true)
    expect(isValidRepoFormat('invalid-single-word')).toBe(false)
    expect(isValidRepoFormat('')).toBe(false)
  })
})
