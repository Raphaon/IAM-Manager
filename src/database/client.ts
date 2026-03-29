import mongoose from 'mongoose'
import { appConfig } from '../config/app.config'

export const connectDB = async () => {
  try {
    await mongoose.connect(appConfig.mongoUri)
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error(' MongoDB error:', error)
    process.exit(1)
  }
}