// ── Shared API & session helpers ──────────────────────────────────────────────

export const BASE_URL = 'http://localhost:5000';

// ── Session helpers ───────────────────────────────────────────────────────────

/** Returns the full stored user object { nom, role, token } or null. */
export function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user') || 'null');
    } catch {
        return null;
    }
}

/** Returns the JWT token string or null. */
export function getToken() {
    return getUser()?.token || null;
}

/**
 * Returns true if a non-expired JWT is present in localStorage.
 * Decodes the payload client-side (no signature check — just expiry).
 */
export function isLoggedIn() {
    const token = getToken();
    if (!token) return false;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

/** Returns the user's role ('Vendeur' or 'Utilisateur') or null. */
export function getUserRole() {
    return getUser()?.role || null;
}

/**
 * Returns the user's first name from the stored session.
 * Safe to call on any page — returns '' if not logged in.
 */
export function getNomUtilisateur() {
    const user = getUser();
    if (!user?.nom) return '';
    return user.nom.split(' ')[0];
}

/** Clears the session from localStorage. */
export function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
}

// ── Request helpers ───────────────────────────────────────────────────────────

export function publicHeaders() {
    return { 'Content-Type': 'application/json' };
}

export function authHeaders() {
    const token = getToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
}

export async function publicPost(path, body) {
    return fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: publicHeaders(),
        body: JSON.stringify(body),
    });
}

export async function authPost(path, body) {
    return fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    });
}

export async function publicGet(path) {
    return fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: publicHeaders(),
    });
}

export async function authGet(path) {
    return fetch(`${BASE_URL}${path}`, {
        method: 'GET',
        headers: authHeaders(),
    });
}
