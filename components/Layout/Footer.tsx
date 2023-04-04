import { Flex, Text } from "@chakra-ui/react";

export default function Footer() {
	const currentYear = new Date().getFullYear();
	return (
		<Flex justify='center' align='center' w='100%' h='40px'>
			<Text fontSize='.8rem'>{`© ${currentYear} ${window.location.hostname}`}</Text>
		</Flex>
	);
}
