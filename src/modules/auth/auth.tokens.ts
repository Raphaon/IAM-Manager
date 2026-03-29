import jwt, { SignOptions } from 'jsonwebtoken'
import crypto from 'crypto'
import { appConfig } from '../../config/app.config'
import { JwtPayload, RefreshTokenPayload } from '../../types/auth.types'

export class AuthTokenService {
  static generateAccessToken(payload: JwtPayload) {
    const options: SignOptions = {
      expiresIn: appConfig.jwtExpiresIn as SignOptions['expiresIn']
    }

    return jwt.sign(payload, appConfig.jwtSecret, options)
  }

  static generateRefreshToken(userId: string) {
    const payload: RefreshTokenPayload = {
      userId,
      type: 'refresh'
    }

    const options: SignOptions = {
      expiresIn: appConfig.jwtRefreshExpiresIn as SignOptions['expiresIn']
    }

    return jwt.sign(payload, appConfig.jwtRefreshSecret, options)
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, appConfig.jwtRefreshSecret) as RefreshTokenPayload
  }

  static hashToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }
}