import express, { Application } from "express"
import morgan from "morgan"
import cors from "cors"
import { checkUser } from "./middlewares/Authentication"
import { apiErrorHandler } from "./middlewares/ErrorHandler"
import { getEnvironmentVariable } from "./utils/EnvironmentVariable"
import homeRouter from "./routes/Home"
import { AppDataSource } from "./models/DataSource"

export const createServer = () => {
  const app: Application = express()

  app.use(express.json())
  app.use(morgan("tiny"))
  app.use(express.static("public"))
  app.use(cors({ origin: getEnvironmentVariable("WEB_FRONTEND_URL") }))

  app.use(homeRouter)

  app.use(checkUser)

  app.use(apiErrorHandler)

  return app
}

export const initializeDataSource = async () => {
  await AppDataSource.initialize()
  console.log("Connected to the database.")
}
