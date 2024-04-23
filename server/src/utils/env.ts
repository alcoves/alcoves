function createEnvConfig(requiredVars: string[]): Record<string, string> {
    const config: Record<string, string> = {}

    requiredVars.forEach((varName) => {
        const value = process.env[varName]
        if (!value) {
            throw new Error(`Missing required environment variable: ${varName}`)
        }
        config[varName] = value
    })

    return config
}

export const env = createEnvConfig(['ALCOVES_REDIS_HOST', 'ALCOVES_REDIS_PORT'])
