export const API_URL =
	(import.meta.env.VITE_API_URL as string) || window.location.origin;

export const GOOGLE_REDIRECT_URL = import.meta.env
	.VITE_GOOGLE_REDIRECT_URL as string;
