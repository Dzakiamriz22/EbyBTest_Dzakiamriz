export async function getNotes(apiNotesUrl, apiRequest) {
  const response = await apiRequest(apiNotesUrl)

  if (!response.ok) {
    throw new Error('Gagal mengambil daftar catatan')
  }

  const data = await response.json()
  return Array.isArray(data) ? data : data.value || []
}

export async function saveNote(apiNotesUrl, noteId, payload, apiRequest) {
  const endpoint = noteId ? `${apiNotesUrl}/${noteId}` : apiNotesUrl
  const method = noteId ? 'PUT' : 'POST'

  const response = await apiRequest(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(noteId ? 'Gagal memperbarui catatan' : 'Gagal menambahkan catatan')
  }
}

export async function deleteNote(apiNotesUrl, noteId, apiRequest) {
  const response = await apiRequest(`${apiNotesUrl}/${noteId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Gagal menghapus catatan')
  }
}
