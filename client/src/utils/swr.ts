import { API_URL } from '../config/env'

export const fetcher = (url: string) =>
    fetch(`${API_URL}${url}`).then((res) => res.json())
