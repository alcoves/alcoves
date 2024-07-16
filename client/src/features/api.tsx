import { API_URL } from '../config/env'

export function getUser() {
    return fetch(`${API_URL}/api/users/me`, {
        credentials: 'include',
    }).then((res) => res.json())
}

export function logoutUser() {
    return fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    }).then((res) => res.json())
}
