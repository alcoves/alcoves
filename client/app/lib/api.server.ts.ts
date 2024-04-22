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

async function apiRequest<T>(
    url: string,
    options: RequestInit,
    request?: Request | null
): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    }

    if (request) {
        const user = await authenticator.isAuthenticated(request)
        console.log('API QUERY', user)
        if (user) {
            headers['Authorization'] = `Bearer ${user?.session_id}`
        }
    }

    const response = await fetch(url, {
        headers,
        ...options,
    })
    const data = await response.json()
    return data as T
}

export async function login(
    input: UserLoginRequest
): Promise<UserLoginResponse> {
    return await apiRequest(`${alcovesEndpoint}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export async function register(
    input: UserRegisterRequest
): Promise<UserLoginResponse> {
    return await apiRequest(`${alcovesEndpoint}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export async function createUpload(
    input: CreateUploadReq
): Promise<CreateUploadRes> {
    return await apiRequest(`${alcovesEndpoint}/uploads`, {
        method: 'POST',
        body: JSON.stringify(input),
    })
}

export async function completedUpload(
    input: CompleteUploadReq
): Promise<CompleteUploadRes> {
    return await apiRequest(`${alcovesEndpoint}/uploads/${input.id}/complete`, {
        method: 'POST',
    })
}
