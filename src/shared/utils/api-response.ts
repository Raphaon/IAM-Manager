export const successResponse = <T>(data: T, meta?: Record<string, unknown>) => ({
  success: true,
  data,
  meta: meta ?? null
})

export const errorResponse = (message: string, details?: unknown) => ({
  success: false,
  message,
  details: details ?? null
})