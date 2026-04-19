function NotesPanel({
  isEditing,
  title,
  content,
  error,
  success,
  loading,
  submitting,
  notes,
  titleMinLength,
  contentMaxLength,
  onSubmit,
  onReset,
  onLogout,
  onRefresh,
  onSetTitle,
  onSetContent,
  onEdit,
  onDelete,
  formatDate,
}) {
  return (
    <section className="layout-grid">
      <article className="panel panel-form">
        <div className="panel-top">
          <h2>{isEditing ? 'Edit Catatan' : 'Tambah Catatan'}</h2>
          <button type="button" className="btn btn-ghost" onClick={onLogout}>
            Logout
          </button>
        </div>

        <form onSubmit={onSubmit} className="note-form">
          <label htmlFor="title">Judul</label>
          <input
            id="title"
            type="text"
            placeholder="Contoh: Rencana minggu ini"
            value={title}
            onChange={(event) => onSetTitle(event.target.value)}
            maxLength={255}
            required
          />
          <small className="helper-text">Minimal {titleMinLength} karakter.</small>

          <label htmlFor="content">Isi Catatan</label>
          <textarea
            id="content"
            rows={6}
            placeholder="Tulis detail catatan di sini..."
            value={content}
            onChange={(event) => onSetContent(event.target.value)}
            maxLength={contentMaxLength}
          />
          <small className="helper-text">{content.trim().length}/{contentMaxLength} karakter.</small>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}

          <div className="action-row">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Menyimpan...' : isEditing ? 'Update' : 'Simpan'}
            </button>

            {isEditing && (
              <button type="button" className="btn btn-ghost" onClick={onReset}>
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
            onClick={onRefresh}
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
                    onClick={() => onEdit(note)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onDelete(note.id)}
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
  )
}

export default NotesPanel
