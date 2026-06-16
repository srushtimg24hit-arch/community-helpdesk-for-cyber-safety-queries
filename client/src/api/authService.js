import api from './api';

// Each function returns { success: boolean, data?: any, error?: string }

export async function login(email, password) {
  try {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      try { localStorage.setItem('token', res.data.token); } catch (e) {}
    }
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function register(name, email, password) {
  try {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data?.token) {
      try { localStorage.setItem('token', res.data.token); } catch (e) {}
    }
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // ignore server errors
  } finally {
    try { localStorage.removeItem('token'); } catch (e) {}
  }
  return { success: true };
}

export async function getMe() {
  try {
    const res = await api.get('/auth/me');
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
