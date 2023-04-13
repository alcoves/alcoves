import Link from "next/link";
import { Avatar, Flex } from "@chakra-ui/react";

function Profile() {
	return (
		<Link href='/login'>
			<Avatar size='sm' name='Test User' />
		</Link>
	);
}

export default function TopBar() {
	return (
		<Flex bg='gray.900' w='100%' h='50px' justify='end' align='center' p='1'>
			<Flex align='center'>
				<Profile />
			</Flex>
		</Flex>
	);
}
