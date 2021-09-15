export const fetcher = (url, opts = {}) => fetch(url, opts).then(res => res.json())
