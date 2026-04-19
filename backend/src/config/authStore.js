const activeTokens = new Set();

function issueToken(email) {
  const raw = `${email}:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  const token = Buffer.from(raw).toString('base64url');
  activeTokens.add(token);
  return token;
}

function isTokenValid(token) {
  return activeTokens.has(token);
}

function revokeToken(token) {
  activeTokens.delete(token);
}

module.exports = {
  issueToken,
  isTokenValid,
  revokeToken,
};
