require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await pool.query('SELECT 1');
    console.log('Database terkoneksi');

    app.listen(port, () => {
      console.log(`Server berjalan di http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Gagal start server:', error.message || error);
    process.exit(1);
  }
}

startServer();
