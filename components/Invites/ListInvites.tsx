import InviteItem from "./InviteItem";

import { listInvites } from "../../lib/api";
import { Box, Skeleton, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";

export default function ListInvites() {
	const { isLoading, isError, data, error } = useQuery({
		queryKey: ["invites"],
		queryFn: listInvites,
	});

	if (isError) {
		// TODO :: Toast notification
		return null;
	}

	if (isLoading) {
		return (
			<Box>
				<Stack>
					<Skeleton height='20px' />
					<Skeleton height='20px' />
					<Skeleton height='20px' />
				</Stack>
			</Box>
		);
	}

	return (
		<Box>
			<InviteItem />
		</Box>
	);
}
