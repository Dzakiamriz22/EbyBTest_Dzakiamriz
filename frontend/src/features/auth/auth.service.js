export async function fetchDemoAccount(apiAuthUrl, fallbackAccount) {
  try {
    const response = await fetch(`${apiAuthUrl}/demo-account`)

    if (!response.ok) {
      return fallbackAccount
    }

    const data = await response.json()
    return {
      email: data.email || fallbackAccount.email,
      password: data.password || fallbackAccount.password,
    }
  } catch {
    return fallbackAccount
  }
}

export async function login(apiAuthUrl, email, password) {
  const response = await fetch(`${apiAuthUrl}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })

  if (!response.ok) {
    throw new Error('Login gagal, cek email/password')
  }

  return response.json()
}

export async function logout(apiRequest, apiAuthUrl) {
  try {
    await apiRequest(`${apiAuthUrl}/logout`, {
      method: 'POST',
    })
  } catch {
    // Abaikan error logout API.
  }
}
