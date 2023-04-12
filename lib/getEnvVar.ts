const getEnvVar = (key: string, fallback?: string) => {
  const val = process.env[key]

  if (val === undefined) {
    if (fallback === undefined) {
      throw new Error(`No environment variable for "${key}" found.`)
    }

    return fallback
  }

  return val
}

export default getEnvVar
