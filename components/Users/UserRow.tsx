import { User } from "../../types/types";
import AssignRole from "./AssignRole";
import RemoveUser from "./RemoveUser";
import { Avatar, Box, Flex, Text } from "@chakra-ui/react";

export default function UserRow({ user }: { user: User }) {
	return (
		<Flex p='2' w='100%' justify='space-between' align='center'>
			<Flex>
				<Avatar size='md' name={user.username} />
				<Box ml='4'>
					<Text fontSize='1.2rem'>{user.username}</Text>
					<Text fontSize='.8rem'>{user.id}</Text>
				</Box>
			</Flex>
			<Flex>
				<AssignRole user={user} />
				<RemoveUser user={user} />
			</Flex>
		</Flex>
	);
}
