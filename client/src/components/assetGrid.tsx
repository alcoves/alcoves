import { Box } from '@chakra-ui/react'
import { Asset } from '../features/api'
import DeleteAsset from './deleteAsset'

export default function AssetGrid({ assets }: { assets: Asset[] | undefined }) {
    return (
        <Box>
            {assets?.map((asset) => (
                <Box key={asset.id} border="solid red 1px" rounded="md">
                    <h2>{asset.title}</h2>
                    <p>{asset.size}</p>
                    <p>{asset.contentType}</p>
                    <p>{asset.createdAt}</p>
                    <p>{asset.updatedAt}</p>
                    <DeleteAsset id={asset?.id} />
                </Box>
            ))}
        </Box>
    )
}
