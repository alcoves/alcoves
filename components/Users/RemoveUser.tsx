import { useEffect } from "react";
import { User } from "../../types/types";
import { removeUser } from "../../lib/api";
import { IoTrashBinSharp } from "react-icons/io5";
import { Button, useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function RemoveUser({ user }: { user: User }) {
	const toast = useToast();
	const queryClient = useQueryClient();
	const { mutate, isLoading, isError, isSuccess } = useMutation({
		mutationFn: removeUser,
	});

	useEffect(() => {
		if (isSuccess) {
			queryClient.invalidateQueries({ queryKey: ["list_users"] });
		}
	}, [queryClient, isSuccess]);

	useEffect(() => {
		if (isError) {
			toast({
				title: "Failed to remove user.",
				status: "error",
				duration: 9000,
				isClosable: true,
			});
		}
	}, [toast, queryClient, isError]);

	return (
		<Button
			size='xs'
			colorScheme='red'
			isLoading={isLoading}
			leftIcon={<IoTrashBinSharp />}
			onClick={() => mutate({ userId: user.id })}
		>
			Remove
		</Button>
	);
}
