import axios from "axios";
import { PUBLIC_ALCOVES_API_URL } from "$env/static/public";

export const clientApi = axios.create({
    baseURL: PUBLIC_ALCOVES_API_URL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
});