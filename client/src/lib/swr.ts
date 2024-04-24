const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const fetcher = (url: string) =>
    fetch(`${API_URL}${url}`).then((res) => res.json())
