import { alcovesEndpoint } from './env'
import { authenticator } from '../services/auth.server'

interface UserLoginResponse {
  status: string
  message: string
  session_id: string
}

interface UserLoginRequest {
  email: string
  password: string
}

interface HealthCheckResponse {
  message: string
  status: string
}

interface GetTasksResponse {
  tasks: any[]
}

async function apiRequest<TRequest, TResponse>(
  url: string,
  options: RequestInit,
  request?: Request | null
): Promise<TResponse> {
  const headers: any = {
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
  return data
}

async function login(input: UserLoginRequest): Promise<UserLoginResponse> {
  return await apiRequest<UserLoginRequest, UserLoginResponse>(
    `${alcovesEndpoint}/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  )
}

async function register(input: UserLoginRequest): Promise<UserLoginResponse> {
  return await apiRequest<UserLoginRequest, UserLoginResponse>(
    `${alcovesEndpoint}/auth/register`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    }
  )
}

async function getHealthCheck(request: Request): Promise<HealthCheckResponse> {
  return await apiRequest<null, HealthCheckResponse>(
    `${alcovesEndpoint}/health`,
    {
      method: 'GET',
    },
    request
  )
}

async function getTasks(request: Request): Promise<GetTasksResponse> {
  return await apiRequest<null, GetTasksResponse>(
    `${alcovesEndpoint}/tasks`,
    {
      method: 'GET',
    },
    request
  )
}

// import { treaty } from '@elysiajs/eden'
// import type { App } from './server'
// const app = treaty<unknown>('http://api:4000')
// const { data, error } = app.health.get()
// console.log(data, error)

export { login, register, getHealthCheck, getTasks }
