import dotenv from 'dotenv'

dotenv.config()

export const appConfig = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: process.env.MONGO_URI || '',
  env: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
}