import { alcovesEndpoint } from './env'
import { authenticator } from './auth.server'

export interface UserLoginResponse {
    status: string
    message: string
    session_id: string
}

interface UserLoginRequest {
    username: string
    password: string
}

interface UserRegisterRequest {
    email: string
    username: string
    password: string
}

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

export interface Alcoves {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    membership: {
        role: string
    }
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

export async function register(
    input: UserRegisterRequest,
    request: Request
): Promise<UserLoginResponse> {
    return await apiRequest(
        `${alcovesEndpoint}/auth/register`,
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
        `${alcovesEndpoint}/uploads`,
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
        `${alcovesEndpoint}/uploads/${input.id}/complete`,
        {
            method: 'POST',
        },
        request
    )
}

export async function getAlcoves(request: Request): Promise<Alcoves[]> {
    return await apiRequest(
        `${alcovesEndpoint}/alcoves`,
        {
            method: 'GET',
        },
        request
    )
}
