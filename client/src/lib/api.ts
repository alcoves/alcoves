import axios from "axios";
import { QueryClient } from "@tanstack/svelte-query";
import { PUBLIC_ALCOVES_API_URL } from "$env/static/public";
import { browser } from "$app/environment";

export const clientApi = axios.create({
    baseURL: PUBLIC_ALCOVES_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
});


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            enabled: browser,
        },
    },
});


export { queryClient }