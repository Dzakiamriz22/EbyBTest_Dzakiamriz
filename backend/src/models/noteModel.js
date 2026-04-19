const pool = require('../config/db');

async function createNote({ title, content }) {
  const query = 'INSERT INTO notes (title, content) VALUES (?, ?)';
  const [result] = await pool.execute(query, [title, content]);
  return result.insertId;
}

async function getAllNotes() {
  const query = 'SELECT id, title, content, created_at, updated_at FROM notes ORDER BY updated_at DESC';
  const [rows] = await pool.execute(query);
  return rows;
}

async function getNoteById(id) {
  const query = 'SELECT id, title, content, created_at, updated_at FROM notes WHERE id = ?';
  const [rows] = await pool.execute(query, [id]);
  return rows[0] || null;
}

async function updateNote(id, { title, content }) {
  const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
  const [result] = await pool.execute(query, [title, content, id]);
  return result.affectedRows > 0;
}

async function deleteNote(id) {
  const query = 'DELETE FROM notes WHERE id = ?';
  const [result] = await pool.execute(query, [id]);
  return result.affectedRows > 0;
}

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
