/**
 * A simple utility function that builds an API URL with a path.
 * @param path A path with a trailing slash.
 * @returns The full API URL.
 */
const apiUrl = (path?: string) => `${process.env.NEXT_PUBLIC_API_URL}${path ?? ''}`

export default apiUrl
