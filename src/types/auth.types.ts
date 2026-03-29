export interface RegisterDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface JwtPayload {
  userId: string
  email: string
  systemRole: 'admin' | 'user'
}

export interface RefreshTokenPayload {
  userId: string
  type: 'refresh'
}

export interface RefreshTokenDto {
  refreshToken: string
}