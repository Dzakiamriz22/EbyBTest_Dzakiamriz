const express = require('express');
const cors = require('cors');
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API berjalan' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', authMiddleware, noteRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
