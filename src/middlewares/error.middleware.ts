import { Request, Response, NextFunction } from 'express'
import { AppError } from '../shared/errors/AppError'
import { errorResponse } from '../shared/utils/api-response'

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json(
      errorResponse(err.message, err.details)
    )
  }

  console.error(err)

  return res.status(500).json(
    errorResponse('Internal Server Error')
  )
}