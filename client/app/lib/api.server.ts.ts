import { authenticator } from './auth.server'
import { ALCOVES_CLIENT_API_ENDPOINT } from './env'

interface CreateUploadReq {
    size: number
    filename: string
    contentType: string
}

interface CreateUploadRes {
    size: number
    filename: string
    contentType: string
}

interface CompleteUploadReq {
    id: string
}

interface CompleteUploadRes {
    id: string
}

export interface Alcove {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    membership: {
        role: string
    }
}

export interface Video {
    id: string
    title: string
    uploadId: string
    userId: string
    alcoveId: string
    storageBucket: string
    storageKey: string
    createdAt: string
    updatedAt: string
    streams: {
        url: string
    }[]
}

export interface Upload {
    id: string
    size: number
    filename: string
    contentType: string
    status: string
    storageBucket: string
    storageKey: string
    createdAt: string
    updatedAt: string
}

async function apiRequest<T>(
    url: string,
    options: RequestInit,
    request: Request
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    if (request) {
        const user = await authenticator.isAuthenticated(request)
        if (user) {
            headers['Authorization'] = `Bearer ${user?.session_id}`
        }
    }

    try {
        const response = await fetch(url, {
            headers,
            ...options,
        })
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        const data = await response.json()
        return data as T
    } catch (error) {
        throw new Error(`API request failed: ${error}`)
    }
}

export interface UserRegisterRes {
    status: string
    message: string
    session_id: string
}

interface UserRegisterReq {
    email: string
    username: string
    password: string
}

export async function register(
    input: UserRegisterReq,
    request: Request
): Promise<UserRegisterRes> {
    return await apiRequest(
        `${ALCOVES_CLIENT_API_ENDPOINT}/auth/register`,
        {
            method: 'POST',
            body: JSON.stringify(input),
        },
        request
    )
}

export async function createUpload(
    input: CreateUploadReq,
    request: Request
): Promise<CreateUploadRes> {
    return await apiRequest(
        `${ALCOVES_CLIENT_API_ENDPOINT}/uploads`,
        {
            method: 'POST',
            body: JSON.stringify(input),
        },
        request
    )
}

export async function completedUpload(
    input: CompleteUploadReq,
    request: Request
): Promise<CompleteUploadRes> {
    return await apiRequest(
        `${ALCOVES_CLIENT_API_ENDPOINT}/uploads/${input.id}/complete`,
        {
            method: 'POST',
        },
        request
    )
}

export async function getAlcoves(request: Request): Promise<Alcove[]> {
    return await apiRequest(
        `${ALCOVES_CLIENT_API_ENDPOINT}/alcoves`,
        {
            method: 'GET',
        },
        request
    )
}

interface GetAlcoveReq {
    alcoveId: string
}

interface GetAlcoveRes {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    membership: {
        role: string
    }
}

export async function getAlcove(
    input: GetAlcoveReq,
    request: Request
): Promise<GetAlcoveRes> {
    return await apiRequest(
        `${ALCOVES_CLIENT_API_ENDPOINT}/alcoves/${input.alcoveId}`,
        {
            method: 'GET',
        },
        request
    )
}

export async function getAlcoveVideos(
    input: { alcoveId: string },
    request: Request
): Promise<{ videos: Video[] }> {
    return await apiRequest(
        `${ALCOVES_CLIENT_API_ENDPOINT}/alcoves/${input.alcoveId}/videos`,
        {
            method: 'GET',
        },
        request
    )
}
