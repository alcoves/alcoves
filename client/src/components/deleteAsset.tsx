import { Button } from "@chakra-ui/react";
import { deleteAsset } from "../features/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DeleteAsset({ id }: { id: string }) {
	const queryClient = useQueryClient();
	const { mutateAsync, isPending } = useMutation({ mutationFn: deleteAsset });

	async function handleDelete() {
		await mutateAsync(id);
		queryClient.invalidateQueries({ queryKey: ["assets"] });
	}

	return (
		<Button colorScheme="red" isLoading={isPending} onClick={handleDelete}>
			Delete
		</Button>
	);
}
