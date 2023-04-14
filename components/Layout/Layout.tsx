import Footer from "./Footer";
import TopBar from "./TopBar";

import { Box, Flex } from "@chakra-ui/react";

export default function Layout({ children }) {
	return (
		<Box overflow='hidden'>
			<TopBar />
			<Flex h='calc(100vh - 100px)' w='100%' overflowY='auto'>
				{children}
			</Flex>
			<Footer />
		</Box>
	);
}
