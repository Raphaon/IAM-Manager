export interface PaginationQuery {
  page?: unknown
  limit?: unknown
}

export interface PaginationResult {
  page: number
  limit: number
  skip: number
}

export const getPagination = (
  query: PaginationQuery,
  defaultLimit = 10,
  maxLimit = 100
): PaginationResult => {
  const rawPage = Number(query.page)
  const rawLimit = Number(query.limit)

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const limit =
    Number.isInteger(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, maxLimit)
      : defaultLimit

  return {
    page,
    limit,
    skip: (page - 1) * limit
  }
}