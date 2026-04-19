const { issueToken, revokeToken } = require('../config/authStore');

const DEMO_EMAIL = process.env.DEMO_LOGIN_EMAIL || 'tester@notes.local';
const DEMO_PASSWORD = process.env.DEMO_LOGIN_PASSWORD || '12345678';

async function getDemoAccount(req, res) {
  res.status(200).json({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi' });
  }

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return res.status(401).json({ message: 'Email atau password salah' });
  }

  const token = issueToken(email);

  return res.status(200).json({
    token,
    user: {
      email,
      name: 'Demo User',
    },
  });
}

async function logout(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (token) {
    revokeToken(token);
  }

  return res.status(200).json({ message: 'Berhasil logout' });
}

module.exports = {
  getDemoAccount,
  login,
  logout,
};
