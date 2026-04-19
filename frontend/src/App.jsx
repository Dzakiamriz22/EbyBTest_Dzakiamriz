import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_ROOT =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ||
  'http://localhost:3000/api'
const API_BASE_URL = `${API_ROOT}/notes`
const API_AUTH_URL = `${API_ROOT}/auth`
const AUTH_TOKEN_KEY = 'notes_app_token'
const DEMO_EMAIL_FALLBACK = import.meta.env.VITE_DEMO_EMAIL || 'tester@notes.local'
const DEMO_PASSWORD_FALLBACK = import.meta.env.VITE_DEMO_PASSWORD || '12345678'
const TITLE_MIN_LENGTH = 3
const CONTENT_MAX_LENGTH = 5000

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

  async function fetchDemoAccount() {
    try {
      const response = await fetch(`${API_AUTH_URL}/demo-account`)

      if (!response.ok) {
        return
      }

      const data = await response.json()
      setDemoAccount({
        email: data.email || DEMO_EMAIL_FALLBACK,
        password: data.password || DEMO_PASSWORD_FALLBACK,
      })
    } catch {
      // Tetap aman karena fallback akun demo sudah diset di state awal.
    }
  }

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
      const response = await apiRequest(API_BASE_URL)

      if (!response.ok) {
        throw new Error('Gagal mengambil daftar catatan')
      }

      const data = await response.json()
      setNotes(Array.isArray(data) ? data : data.value || [])
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDemoAccount()
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
      const response = await apiRequest(
        `${API_AUTH_URL}/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword,
          }),
        },
        false,
      )

      if (!response.ok) {
        throw new Error('Login gagal, cek email/password')
      }

      const data = await response.json()
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
    try {
      await apiRequest(
        `${API_AUTH_URL}/logout`,
        {
          method: 'POST',
        },
        true,
      )
    } catch {
      // Abaikan error logout API, tetap hapus token di client.
    }

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

      const endpoint = isEditing ? `${API_BASE_URL}/${editingId}` : API_BASE_URL
      const method = isEditing ? 'PUT' : 'POST'

      const securedResponse = await apiRequest(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!securedResponse.ok) {
        throw new Error(
          isEditing ? 'Gagal memperbarui catatan' : 'Gagal menambahkan catatan',
        )
      }

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
      const response = await apiRequest(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Gagal menghapus catatan')
      }

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
        <section className="panel panel-auth">
          <h2>Login</h2>

          {demoAccount.email && (
            <div className="demo-box">
              <p><strong>Akun demo untuk tester:</strong></p>
              <p>Email: {demoAccount.email}</p>
              <p>Password: {demoAccount.password}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="note-form">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              value={loginEmail}
              onChange={(event) => setLoginEmail(event.target.value)}
              placeholder="email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              value={loginPassword}
              onChange={(event) => setLoginPassword(event.target.value)}
              placeholder="password"
              required
            />

            {authError && <p className="error-text">{authError}</p>}

            <div className="action-row">
              <button type="submit" className="btn btn-primary" disabled={authLoading}>
                {authLoading ? 'Masuk...' : 'Login'}
              </button>
            </div>
          </form>
        </section>
      ) : (
      <section className="layout-grid">
        <article className="panel panel-form">
          <div className="panel-top">
            <h2>{isEditing ? 'Edit Catatan' : 'Tambah Catatan'}</h2>
            <button type="button" className="btn btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <form onSubmit={handleSubmit} className="note-form">
            <label htmlFor="title">Judul</label>
            <input
              id="title"
              type="text"
              placeholder="Contoh: Rencana minggu ini"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={255}
              required
            />
            <small className="helper-text">Minimal {TITLE_MIN_LENGTH} karakter.</small>

            <label htmlFor="content">Isi Catatan</label>
            <textarea
              id="content"
              rows={6}
              placeholder="Tulis detail catatan di sini..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              maxLength={CONTENT_MAX_LENGTH}
            />
            <small className="helper-text">{content.trim().length}/{CONTENT_MAX_LENGTH} karakter.</small>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <div className="action-row">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Menyimpan...' : isEditing ? 'Update' : 'Simpan'}
              </button>

              {isEditing && (
                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </article>

        <article className="panel panel-list">
          <div className="panel-top">
            <h2>Daftar Catatan</h2>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSuccess('')
                fetchNotes()
              }}
              disabled={loading}
            >
              {loading ? 'Memuat...' : 'Refresh'}
            </button>
          </div>

          {loading ? (
            <p className="empty-state">Memuat data...</p>
          ) : notes.length === 0 ? (
            <p className="empty-state">Belum ada catatan. Tambah catatan pertama Anda.</p>
          ) : (
            <ul className="note-list">
              {notes.map((note) => (
                <li key={note.id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content || 'Tanpa isi catatan.'}</p>
                  <small>Update terakhir: {formatDate(note.updated_at)}</small>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(note.id)}
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
      )}
    </main>
  )
}

export default App
