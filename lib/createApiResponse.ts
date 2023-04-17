/**
 * Formats a reply from the API in order to keep API replies consistent.
 * @param ok Whether or not the request has succeeded.
 * @param data Any data to send to the client.
 * @param msg An optional message.
 * @returns A reply object.
 */
function createApiResponse<T>(ok: boolean, data: T, msg?: string) {
  const reply: APIResponse<T> = { ok, msg, data }

  return reply
}

export default createApiResponse
