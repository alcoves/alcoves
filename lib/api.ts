import axios from 'axios'
import { User } from '../types/types'

// Sets all axios requests to send credentials with requests.
axios.defaults.withCredentials = true

export async function login({ email, password }: { email: string; password: string }) {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`, {
      email,
      password,
    })
    return response.data
  } catch (error) {
    console.error(error)
  }
}

export async function getMe(): Promise<User | undefined> {
  try {
    const response = await axios(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/users/me`)
    return response.data
  } catch (error) {
    console.error(error)
  }
}
