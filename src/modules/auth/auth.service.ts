import bcrypt from 'bcrypt'
import { UserService } from '../users/user.service'
import { RegisterDto, LoginDto, JwtPayload, RefreshTokenDto } from '../../types/auth.types'
import { AppError } from '../../shared/errors/AppError'
import {
  isValidEmail,
  isStrongEnoughPassword
} from '../../shared/utils/validators'
import { RefreshToken } from './refresh-token.model'
import { AuthTokenService } from './auth.tokens'

export class AuthService {
  static async register(data: RegisterDto) {
    const email = data.email?.toLowerCase().trim()

    if (!email || !isValidEmail(email)) {
      throw new AppError('Invalid email', 400)
    }

    if (!isStrongEnoughPassword(data.password)) {
      throw new AppError('Password must contain at least 6 characters', 400)
    }

    const existingUser = await UserService.findByEmail(email)

    if (existingUser) {
      throw new AppError('User already exists', 409)
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await UserService.create({
      email,
      passwordHash,
      firstName: data.firstName?.trim(),
      lastName: data.lastName?.trim()
    })

    const payload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      systemRole: user.systemRole
    }

    const accessToken = AuthTokenService.generateAccessToken(payload)
    const refreshToken = AuthTokenService.generateRefreshToken(String(user._id))
    const tokenHash = AuthTokenService.hashToken(refreshToken)

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    return {
      user: {
        id: String(user._id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isVerified: user.isVerified,
        systemRole: user.systemRole
      },
      accessToken,
      refreshToken
    }
  }

  static async login(data: LoginDto) {
    const email = data.email?.toLowerCase().trim()

    if (!email || !data.password) {
      throw new AppError('Email and password are required', 400)
    }

    const user = await UserService.findByEmail(email)

    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    if (!user.isActive) {
      throw new AppError('User is inactive', 403)
    }

    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    )

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401)
    }

    await UserService.updateLastLogin(String(user._id))

    const payload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      systemRole: user.systemRole
    }

    const accessToken = AuthTokenService.generateAccessToken(payload)
    const refreshToken = AuthTokenService.generateRefreshToken(String(user._id))
    const tokenHash = AuthTokenService.hashToken(refreshToken)

    await RefreshToken.create({
      userId: user._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    return {
      user: {
        id: String(user._id),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isActive: user.isActive,
        isVerified: user.isVerified,
        systemRole: user.systemRole
      },
      accessToken,
      refreshToken
    }
  }

  static async refresh(data: RefreshTokenDto) {
    if (!data.refreshToken) {
      throw new AppError('refreshToken is required', 400)
    }

    const payload = AuthTokenService.verifyRefreshToken(data.refreshToken)

    if (payload.type !== 'refresh') {
      throw new AppError('Invalid refresh token', 401)
    }

    const tokenHash = AuthTokenService.hashToken(data.refreshToken)

    const storedToken = await RefreshToken.findOne({
      tokenHash,
      revokedAt: null
    })

    if (!storedToken) {
      throw new AppError('Refresh token not found or revoked', 401)
    }

    if (storedToken.expiresAt.getTime() < Date.now()) {
      throw new AppError('Refresh token expired', 401)
    }

    const user = await UserService.findById(payload.userId)

    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401)
    }

    const accessPayload: JwtPayload = {
      userId: String(user._id),
      email: user.email,
      systemRole: user.systemRole
    }

    const accessToken = AuthTokenService.generateAccessToken(accessPayload)

    return { accessToken }
  }

  static async logout(data: RefreshTokenDto) {
    if (!data.refreshToken) {
      throw new AppError('refreshToken is required', 400)
    }

    const tokenHash = AuthTokenService.hashToken(data.refreshToken)

    await RefreshToken.findOneAndUpdate(
      { tokenHash, revokedAt: null },
      { revokedAt: new Date() }
    )

    return { message: 'Logged out successfully' }
  }
}