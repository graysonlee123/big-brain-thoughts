function createApiResponse<T = any>(ok: boolean, data?: T, msg?: string) {
  const reply: APIResponse<T> = { ok, msg, data }

  return reply
}

export default createApiResponse
