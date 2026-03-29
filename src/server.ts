import app from './app'
import { connectDB } from './database/client'
import { appConfig } from './config/app.config'

const start = async () => {
  await connectDB()

  app.listen(appConfig.port, () => {
    console.log(` 🚀 Server running on port ${appConfig.port}`)
  })
}

start()