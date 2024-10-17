import { Box } from "@chakra-ui/react";
import type { Asset } from "../features/api";
import DeleteAsset from "./deleteAsset";

export default function AssetGrid({ assets }: { assets: Asset[] | undefined }) {
	return (
		<Box>
			{assets?.map((asset) => (
				<Box key={asset.id} border="solid red 1px" rounded="md">
					<img src={asset?.url} width="400px" />
					<DeleteAsset id={asset?.id} />
				</Box>
			))}
		</Box>
	);
}
