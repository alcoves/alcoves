const API_URL = window.location.origin // The UI must be hosted on the same domain as the API

export const fetcher = (url: string) =>
    fetch(`${API_URL}${url}`).then((res) => res.json())
