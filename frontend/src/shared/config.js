export const API_ROOT =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:3000/api'

export const API_NOTES_URL = `${API_ROOT}/notes`
export const API_AUTH_URL = `${API_ROOT}/auth`
export const AUTH_TOKEN_KEY = 'notes_app_token'

export const DEMO_EMAIL_FALLBACK = import.meta.env.VITE_DEMO_EMAIL || 'tester@notes.local'
export const DEMO_PASSWORD_FALLBACK = import.meta.env.VITE_DEMO_PASSWORD || '12345678'

export const TITLE_MIN_LENGTH = 3
export const CONTENT_MAX_LENGTH = 5000
