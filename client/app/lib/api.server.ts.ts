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

interface HealthCheckResponse {
    message: string
    status: string
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

// export async function getHealthCheck(
//     request: Request
// ): Promise<HealthCheckResponse> {
//     return await apiRequest(
//         `${alcovesEndpoint}/health`,
//         {
//             method: 'GET',
//         },
//         request
//     )
// }
