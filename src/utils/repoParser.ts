/**
 * Normalizes user input or URL string to "owner/repo" format.
 * Supports:
 * - Full URLs: https://github.com/DonytXz/Pokedex-React
 * - HTTP / WWW: http://www.github.com/DonytXz/Pokedex-React
 * - Domain only: github.com/DonytXz/Pokedex-React
 * - Git SSH: git@github.com:DonytXz/Pokedex-React.git
 * - Git Clone URLs: https://github.com/DonytXz/Pokedex-React.git
 * - Deep links: https://github.com/DonytXz/Pokedex-React/tree/main/src
 * - Standard short form: DonytXz/Pokedex-React
 */
export function normalizeRepoInput(input: string): string {
  let cleaned = input.trim()
  if (!cleaned) return ''

  // Remove SSH prefix
  cleaned = cleaned.replace(/^git@github\.com:/i, '')

  // Remove protocol and domain if present
  cleaned = cleaned.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '')

  // Remove trailing .git
  cleaned = cleaned.replace(/\.git$/i, '')

  // Split and take the first two segments (owner and repo)
  const segments = cleaned.split('/').filter(Boolean)
  if (segments.length >= 2) {
    return `${segments[0]}/${segments[1]}`
  }

  return cleaned
}

export function isValidRepoFormat(repo: string): boolean {
  const normalized = normalizeRepoInput(repo)
  const parts = normalized.split('/')
  return parts.length === 2 && parts[0].length > 0 && parts[1].length > 0
}
