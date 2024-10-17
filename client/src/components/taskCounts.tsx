import useSWR from "swr";
import { fetcher } from "../utils/swr";
import { Box, Flex, Heading } from "@chakra-ui/react";

export default function TaskCounts() {
	const { data, error, isLoading } = useSWR("/tasks/counts", fetcher, {
		refreshInterval: 1000,
	});

	console.log("Data", data);
	if (error) return <Box>failed to load</Box>;
	if (isLoading) return <Box>loading...</Box>;

	if (data?.counts) {
		return (
			<Flex py="4">
				<Flex gap="4" flexWrap="wrap">
					{Object.entries(data?.counts).map(([key, value]) => {
						return (
							<Box key={key}>
								<Box>
									<Heading
										fontSize=".8rem"
										isTruncated={true}
										textTransform="uppercase"
									>
										{key}
									</Heading>
								</Box>
								<Box fontSize="1.5rem">{`${value}`}</Box>
							</Box>
						);
					})}
				</Flex>
			</Flex>
		);
	}

	return null;
}
