export function configuration() {
  const requiredEnvironmentVariables = [
    'ALCOVES_TOKEN',
    'ALCOVES_STORAGE_BUCKET',
    'ALCOVES_STORAGE_ENDPOINT',
    'ALCOVES_STORAGE_ACCESS_KEY_ID',
    'ALCOVES_STORAGE_SECRET_ACCESS_KEY',
    'ALCOVES_REDIS_HOST',
    'ALCOVES_REDIS_PORT',
    'ALCOVES_DATABASE_URL',
  ]

  const envErrors = requiredEnvironmentVariables.reduce((acc, envVar) => {
    if (!process.env[envVar]) {
      acc.push(`Missing environment variable: ${envVar}`)
    }
    return acc
  }, [])

  if (envErrors.length) {
    throw new Error(envErrors.join('\n'))
  }

  const envVars = requiredEnvironmentVariables.map((envVar) => {
    return `${envVar}=${process.env[envVar]}`
  })

  return envVars
}
