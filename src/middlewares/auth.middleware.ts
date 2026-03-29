import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { appConfig } from '../config/app.config'
import { JwtPayload } from '../types/auth.types'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, appConfig.jwtSecret) as JwtPayload
    ;(req as any).user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}