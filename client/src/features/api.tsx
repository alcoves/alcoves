import { API_URL } from '../config/env'

export interface Asset {
    id: string
    title: string
    size: number
    contentType: string
    metadata?: unknown
    createdAt: string
    updatedAt: string
}

export interface CreateAssetResponse extends Asset {
    uploadId: string
}

export function getUser() {
    return fetch(`${API_URL}/api/users/me`, {
        credentials: 'include',
    }).then((res) => res.json())
}

export function logoutUser() {
    return fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    }).then((res) => res.json())
}

export interface CreateAssetBody {
    size: number
    title: string
    contentType: string
}

export function createAsset(
    data: CreateAssetBody
): Promise<{ payload: CreateAssetResponse }> {
    return fetch(`${API_URL}/api/assets`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
    }).then((res) => res.json())
}

export function listUserAssets(): Promise<{ payload: Asset[] }> {
    return fetch(`${API_URL}/api/assets`, {
        method: 'GET',
        credentials: 'include',
    }).then((res) => res.json())
}

export function deleteAsset(id: string) {
    return fetch(`${API_URL}/api/assets/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    }).then((res) => res.json())
}

export function getSignedUrlChunk({
    assetId,
    uploadId,
    partId,
}: {
    assetId: string
    uploadId: string
    partId: number
}): Promise<{ payload: string }> {
    return fetch(
        `${API_URL}/api/assets/${assetId}/uploads/${uploadId}/parts/${partId}`,
        {
            method: 'GET',
            credentials: 'include',
        }
    ).then((res) => res.json())
}

export function completeUpload({
    assetId,
    uploadId,
}: {
    assetId: string
    uploadId: string
}) {
    return fetch(`${API_URL}/api/assets/${assetId}/uploads/${uploadId}`, {
        method: 'POST',
        credentials: 'include',
    }).then((res) => res.json())
}
