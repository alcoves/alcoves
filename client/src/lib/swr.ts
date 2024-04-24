const API_URL =
    (import.meta.env.VITE_API_URL as string) || window.location.origin

export const fetcher = (url: string) =>
    fetch(`${API_URL}${url}`).then((res) => res.json())
