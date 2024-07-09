import { API_URL } from './env'

export const fetcher = (url: string) =>
    fetch(`${API_URL}${url}`).then((res) => res.json())
