function LoginPanel({
  demoAccount,
  loginEmail,
  loginPassword,
  authError,
  authLoading,
  onLogin,
  setLoginEmail,
  setLoginPassword,
}) {
  return (
    <section className="panel panel-auth">
      <h2>Login</h2>

      {demoAccount.email && (
        <div className="demo-box">
          <p><strong>Akun demo untuk tester:</strong></p>
          <p>Email: {demoAccount.email}</p>
          <p>Password: {demoAccount.password}</p>
        </div>
      )}

      <form onSubmit={onLogin} className="note-form">
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
  )
}

export default LoginPanel
