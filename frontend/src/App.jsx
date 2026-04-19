import { useEffect, useMemo, useState } from 'react'
import './App.css'
import LoginPanel from './features/auth/LoginPanel'
import { fetchDemoAccount, login, logout } from './features/auth/auth.service'
import NotesPanel from './features/notes/NotesPanel'
import { deleteNote, getNotes, saveNote } from './features/notes/notes.service'
import {
  API_AUTH_URL,
  API_NOTES_URL,
  AUTH_TOKEN_KEY,
  CONTENT_MAX_LENGTH,
  DEMO_EMAIL_FALLBACK,
  DEMO_PASSWORD_FALLBACK,
  TITLE_MIN_LENGTH,
} from './shared/config'

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || '')
  const [loginEmail, setLoginEmail] = useState(DEMO_EMAIL_FALLBACK)
  const [loginPassword, setLoginPassword] = useState(DEMO_PASSWORD_FALLBACK)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [demoAccount, setDemoAccount] = useState({
    email: DEMO_EMAIL_FALLBACK,
    password: DEMO_PASSWORD_FALLBACK,
  })

  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isEditing = useMemo(() => editingId !== null, [editingId])

  async function apiRequest(url, options = {}, withAuth = true) {
    const headers = {
      ...(options.headers || {}),
    }

    if (withAuth && token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (response.status === 401 && withAuth) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      setToken('')
      setNotes([])
      throw new Error('Sesi habis, silakan login lagi')
    }

    return response
  }

  async function fetchNotes() {
    if (!token) {
      setLoading(false)
      return
    }

    setError('')
    setLoading(true)

    try {
      const items = await getNotes(API_NOTES_URL, apiRequest)
      setNotes(items)
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function loadDemoAccount() {
      const account = await fetchDemoAccount(API_AUTH_URL, {
        email: DEMO_EMAIL_FALLBACK,
        password: DEMO_PASSWORD_FALLBACK,
      })
      setDemoAccount(account)
    }

    loadDemoAccount()
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [token])

  async function handleLogin(event) {
    event.preventDefault()

    if (!loginEmail.trim() || !loginPassword) {
      setAuthError('Email dan password wajib diisi')
      return
    }

    setAuthError('')
    setAuthLoading(true)

    try {
      const data = await login(API_AUTH_URL, loginEmail.trim(), loginPassword)
      localStorage.setItem(AUTH_TOKEN_KEY, data.token)
      setToken(data.token)
      setLoginPassword('')
      setAuthError('')
      setSuccess('Login berhasil')
    } catch (err) {
      setAuthError(err.message || 'Login gagal')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleLogout() {
    await logout(apiRequest, API_AUTH_URL)

    localStorage.removeItem(AUTH_TOKEN_KEY)
    setToken('')
    setNotes([])
    setSuccess('')
    setError('')
    resetForm()
  }

  function resetForm() {
    setTitle('')
    setContent('')
    setEditingId(null)
  }

  function notifySuccess(message) {
    setSuccess(message)
    setTimeout(() => {
      setSuccess('')
    }, 2500)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const cleanTitle = title.trim()
    const cleanContent = content.trim()

    if (!cleanTitle) {
      setError('Judul catatan wajib diisi')
      return
    }

    if (cleanTitle.length < TITLE_MIN_LENGTH) {
      setError(`Judul minimal ${TITLE_MIN_LENGTH} karakter`)
      return
    }

    if (cleanContent.length > CONTENT_MAX_LENGTH) {
      setError(`Isi catatan maksimal ${CONTENT_MAX_LENGTH} karakter`)
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const payload = {
        title: cleanTitle,
        content: cleanContent,
      }

      await saveNote(API_NOTES_URL, editingId, payload, apiRequest)

      resetForm()
      await fetchNotes()
      notifySuccess(isEditing ? 'Catatan berhasil diperbarui' : 'Catatan berhasil ditambahkan')
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan catatan')
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(note) {
    setEditingId(note.id)
    setTitle(note.title || '')
    setContent(note.content || '')
    setError('')
    setSuccess('')
  }

  async function handleDelete(id) {
    const confirmed = window.confirm('Yakin ingin menghapus catatan ini?')
    if (!confirmed) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await deleteNote(API_NOTES_URL, id, apiRequest)

      if (editingId === id) {
        resetForm()
      }

      await fetchNotes()
      notifySuccess('Catatan berhasil dihapus')
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menghapus catatan')
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return '-'
    }

    const date = new Date(dateValue)
    return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString('id-ID')
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="kicker">Notes App</p>
        <h1>Catatan Harian</h1>
        <p className="subtitle">
          Login dulu, lalu cek fitur CRUD langsung.
        </p>
      </header>

      {!token ? (
        <LoginPanel
          demoAccount={demoAccount}
          loginEmail={loginEmail}
          loginPassword={loginPassword}
          authError={authError}
          authLoading={authLoading}
          onLogin={handleLogin}
          setLoginEmail={setLoginEmail}
          setLoginPassword={setLoginPassword}
        />
      ) : (
        <NotesPanel
          isEditing={isEditing}
          title={title}
          content={content}
          error={error}
          success={success}
          loading={loading}
          submitting={submitting}
          notes={notes}
          titleMinLength={TITLE_MIN_LENGTH}
          contentMaxLength={CONTENT_MAX_LENGTH}
          onSubmit={handleSubmit}
          onReset={resetForm}
          onLogout={handleLogout}
          onRefresh={() => {
            setSuccess('')
            fetchNotes()
          }}
          onSetTitle={setTitle}
          onSetContent={setContent}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatDate={formatDate}
        />
      )}
    </main>
  )
}

export default App
