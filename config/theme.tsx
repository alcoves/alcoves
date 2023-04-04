import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	fonts: {
		body: `'Inter', sans-serif`,
		heading: `'Inter', sans-serif`,
	},
	config: {
		initialColorMode: "dark",
	},
	colors: {
		brand: {
			900: "#1a365d",
			800: "#153e75",
			700: "#2a69ac",
		},
	},
});

export default theme;
