const AUTH_URL = import.meta.env.VITE_AUTH_URL;
let jwtToken: string | null = localStorage.getItem('token');

export function getJwt() {
  return jwtToken;
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Email atau password salah');
    }

    const data = await response.json();
    jwtToken = data.token;
    if (jwtToken) localStorage.setItem('token', jwtToken);
    
    return data.user;
  } catch (err: any) {
    console.error('Login exception:', err);
    throw err;
  }
}

export async function logout() {
  try {
    await fetch(`${AUTH_URL}/logout`, { method: 'POST' });
  } catch (e) {}
  
  jwtToken = null;
  localStorage.removeItem('token');
  window.location.href = '/admin/login';
}

export async function getSession() {
  try {
    const response = await fetch(`${AUTH_URL}/session`, {
      headers: jwtToken ? { 'Authorization': `Bearer ${jwtToken}` } : {}
    });
    
    if (!response.ok) {
      jwtToken = null;
      localStorage.removeItem('token');
      return null;
    }
    
    const data = await response.json();
    return data.user;
  } catch (err) {
    return null;
  }
}

export async function signUp(email: string, password: string, name: string) {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      return { error: error.message || 'Registration failed' };
    }

    return { error: null };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred' };
  }
}
