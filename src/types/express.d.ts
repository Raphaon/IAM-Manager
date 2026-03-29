import { JwtPayload } from './auth.types'

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        email: string
        systemRole: 'admin' | 'user'
      }
    }
  }
}

export {}