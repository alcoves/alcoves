import daisyui from "daisyui";
import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

const config: Config = {
	safelist: ["dark"],
	darkMode: ["class"],
	content: ["./src/**/*.{html,js,svelte,ts}"],
	plugins: [daisyui],
	daisyui: {
		themes: ["dark", "light"],
	},
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", ...fontFamily.sans],
			},
		},
	},
};

export default config;
