if (!process.env.ALCOVES_CLIENT_API_ENDPOINT) {
  throw new Error('ALCOVES_CLIENT_API_ENDPOINT is required')
}

export const alcovesEndpoint = process.env.ALCOVES_CLIENT_API_ENDPOINT
