// src/utils/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log('MODE:', import.meta.env.MODE);
console.log('BASE_URL:', BASE_URL);

if (!BASE_URL) {
  console.error('❌ Missing VITE_API_BASE_URL');
}

export async function apiGet(path, options = {}, retries = 3) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'GET',
      credentials: 'include',
      ...options,
    });

    const text = await res.text();
    console.log(`[apiGet] Raw response for ${path}:`, text);

    if (!res.ok) throw new Error(`GET ${path} failed (${res.status})`);

    return JSON.parse(text);
  } catch (err) {
    console.error(`Playback error: ${err}`);
    throw err;
  }
}

export async function apiPost(path, body, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    ...options,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API ${res.status}: ${errText}`);
  }

  return await res.json();
}

export async function apiDelete(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    credentials: 'include',
    ...options,
  });

  if (!res.ok) throw new Error(`DELETE ${path} failed`);
  return await res.json();
}

export async function apiLogout() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/logout`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error(`Logout failed: ${res.status}`);
  }

  return await res.json();
}
