import Profile from "../../components/profile";

import { Box } from "@chakra-ui/react";
import type { User } from "../../types/user";
import { getUser } from "../../features/api";
import { useQuery } from "@tanstack/react-query";

export default function ProfileRoute() {
	const { data, isLoading, error } = useQuery({
		queryKey: ["user"],
		queryFn: getUser,
	});

	if (isLoading) return <Box>Loading...</Box>;

	if (error) {
		console.error(error);
		return (
			<Box>
				<Box>Error loading profile</Box>
				<pre>{JSON.stringify(error, null, 2)}</pre>
			</Box>
		);
	}

	const { payload }: { payload: User } = data;
	return <Profile data={payload} />;
}
