const noteModel = require('../models/noteModel');

function isValidPayload(title, content) {
  return typeof title === 'string' && title.trim() !== '' && typeof content === 'string';
}

async function createNote(req, res, next) {
  try {
    const { title, content = '' } = req.body;

    if (!isValidPayload(title, content)) {
      return res.status(400).json({ message: 'title wajib diisi dan content harus string' });
    }

    const id = await noteModel.createNote({
      title: title.trim(),
      content: content.trim(),
    });

    const created = await noteModel.getNoteById(id);
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
}

async function getAllNotes(req, res, next) {
  try {
    const notes = await noteModel.getAllNotes();
    return res.status(200).json(notes);
  } catch (error) {
    return next(error);
  }
}

async function getNoteById(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'id harus berupa angka' });
    }

    const note = await noteModel.getNoteById(id);

    if (!note) {
      return res.status(404).json({ message: 'catatan tidak ditemukan' });
    }

    return res.status(200).json(note);
  } catch (error) {
    return next(error);
  }
}

async function updateNote(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { title, content = '' } = req.body;

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'id harus berupa angka' });
    }

    if (!isValidPayload(title, content)) {
      return res.status(400).json({ message: 'title wajib diisi dan content harus string' });
    }

    const updated = await noteModel.updateNote(id, {
      title: title.trim(),
      content: content.trim(),
    });

    if (!updated) {
      return res.status(404).json({ message: 'catatan tidak ditemukan' });
    }

    const note = await noteModel.getNoteById(id);
    return res.status(200).json(note);
  } catch (error) {
    return next(error);
  }
}

async function deleteNote(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'id harus berupa angka' });
    }

    const deleted = await noteModel.deleteNote(id);

    if (!deleted) {
      return res.status(404).json({ message: 'catatan tidak ditemukan' });
    }

    return res.status(200).json({ message: 'catatan berhasil dihapus' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
