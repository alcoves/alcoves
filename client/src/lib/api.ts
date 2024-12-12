import axios from "axios";
import { QueryClient } from "@tanstack/svelte-query";
import { PUBLIC_ALCOVES_API_URL } from "$env/static/public";
import { browser } from "$app/environment";

export const apiEndpoint = PUBLIC_ALCOVES_API_URL;
export const apiWsEndpoint = PUBLIC_ALCOVES_API_URL.replace("http", "ws").replace("https", "wss");

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