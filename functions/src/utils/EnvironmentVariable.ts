export const getEnvironmentVariable = (name: string) => {
  // jest sets NODE_ENV to "test"
  if (process.env.NODE_ENV) {
    name += "_" + process.env.NODE_ENV.toUpperCase()
  }
  const envVar = process.env[name]
  if (!envVar) {
    throw new Error(`${name} environment variable is not set!`)
  }
  return envVar
}
