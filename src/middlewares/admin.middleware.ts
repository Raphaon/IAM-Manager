import { Request, Response, NextFunction } from 'express'


export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.user.systemRole !== 'admin') {
    console.warn('Admin access denied', {
      userId: req.user.userId,
      path: req.originalUrl,
      method: req.method,
    })
    return res.status(403).json({ message: 'Forbidden' })
  }

  next()
}