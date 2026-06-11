const API_URL = import.meta.env.VITE_API_URL || ''

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Logout API request failed')
  }

  return response.json().catch(() => null)
}
