import { AxiosError, AxiosResponse } from 'axios'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'

interface APIErrorResponse extends AxiosResponse {
  data: {
    error: string
    message: string[]
    statusCode: number
  }
}

interface APIError extends AxiosError {
  response: APIErrorResponse
}

export default function APIErrorAlert({ error }: { error: APIError }) {
  const alertTitle = error?.code || 'Something went wrong!'
  const alertMessage = error?.response?.data?.message

  return (
    <Alert status="error" my="2" rounded="md">
      <AlertIcon />
      <AlertTitle>{alertTitle}</AlertTitle>
      <AlertDescription>{alertMessage}</AlertDescription>
    </Alert>
  )
}
