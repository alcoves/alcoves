import mime from 'mime'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
    region: 'us-east-1',
    endpoint: 'http://localhost:9000',
    forcePathStyle: true,
    credentials: {
        accessKeyId: 'minioadmin',
        secretAccessKey: 'minioadmin',
    },
})

const bucketName = 'alcoves'

export async function generateSignedUrl(storageKey: string) {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: storageKey,
    })

    try {
        const signedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600 * 24,
        })
        return signedUrl
    } catch (error) {
        console.error('Error generating signed URL:', error)
    }
}

export async function generatePresignedPutUrl(
    storageKey: string,
    contentType: string
) {
    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: storageKey,
        ContentType: contentType || 'application/octet-stream',
    })

    try {
        const signedUrl = await getSignedUrl(s3Client, putCommand, {
            expiresIn: 3600,
        })
        console.log('The presigned PUT URL is:', signedUrl)
        return signedUrl
    } catch (error) {
        console.error('Error generating presigned PUT URL:', error)
    }
}

export function getUploadStorageKey(storageKey: string, contentType: string) {
    return `uploads/${storageKey}/${storageKey}.${mime.getExtension(contentType)}`
}

export function getVideoStorageKey(storageKey: string) {
    return `assets/${storageKey}/${storageKey}`
}
