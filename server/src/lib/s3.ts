import { env } from './env'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import {
    S3Client,
    UploadPartCommand,
    CreateMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    CreateMultipartUploadCommandInput,
    ListObjectsV2Command,
    DeleteObjectsCommand,
} from '@aws-sdk/client-s3'

export const s3Client = new S3Client({
    region: env.ALCOVES_OBJECT_STORE_REGION,
    endpoint: process.env.ALCOVES_OBJECT_STORE_ENDPOINT,
    credentials: {
        accessKeyId: env.ALCOVES_OBJECT_STORE_ACCESS_KEY_ID,
        secretAccessKey: env.ALCOVES_OBJECT_STORE_SECRET_ACCESS_KEY,
    },
    forcePathStyle: true,
})

export async function createMultipartUpload(
    data: CreateMultipartUploadCommandInput
) {
    const response = await s3Client.send(new CreateMultipartUploadCommand(data))

    if (!response.UploadId) throw new Error('UploadId not found')
    return response.UploadId
}

export async function getUploadPartUrl({
    uploadId,
    partNumber,
    bucket,
    key,
}: {
    key: string
    bucket: string
    uploadId: string
    partNumber: number
}) {
    const uploadParams = {
        Key: key,
        Bucket: bucket,
        UploadId: uploadId,
        PartNumber: partNumber,
    }

    const command = new UploadPartCommand(uploadParams)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return signedUrl
}

export async function completeMultipartUpload({
    uploadId,
    bucket,
    key,
    parts,
}: {
    key: string
    bucket: string
    uploadId: string
    parts:
        | { ETag: string | undefined; PartNumber: number | undefined }[]
        | undefined
}) {
    const completeParams = {
        Key: key,
        Bucket: bucket,
        UploadId: uploadId,
        MultipartUpload: {
            Parts: parts?.map((part, index) => ({
                ETag: part.ETag,
                PartNumber: index + 1,
            })),
        },
    }

    const command = new CompleteMultipartUploadCommand(completeParams)
    await s3Client.send(command)
}

export async function deleteS3ObjectsByPrefix({
    bucket,
    prefix,
}: {
    bucket: string
    prefix: string
}) {
    const listObjectsResponse = await s3Client.send(
        new ListObjectsV2Command({
            Prefix: prefix,
            Bucket: bucket,
        })
    )

    if (!listObjectsResponse) return

    if ((listObjectsResponse?.Contents?.length ?? 0) > 0) {
        const deleteParams = {
            Bucket: bucket,
            Delete: {
                Objects: listObjectsResponse?.Contents?.map(({ Key }) => ({
                    Key,
                })),
            },
        }

        await s3Client.send(new DeleteObjectsCommand(deleteParams))
    }
}
