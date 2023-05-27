import express, { Application } from "express"
import morgan from "morgan"
import cors from "cors"
import { connectToFirebase } from "./firebase"
import { checkUser } from "./middlewares/Authentication"
import { apiErrorHandler } from "./middlewares/ErrorHandler"
import { getEnvironmentVariable } from "./utils/EnvironmentVariable"
import categoryRouter from "./routes/Category"
import categoryGroupRouter from "./routes/CategoryGroup"
import transactionRouter from "./routes/Transaction"
import userRouter from "./routes/User"

export const createServer = () => {
  const app: Application = express()

  app.use(express.json())
  app.use(morgan("tiny"))
  app.use(express.static("public"))
  app.use(cors({ origin: getEnvironmentVariable("WEB_FRONTEND_URL") }))
  connectToFirebase()

  app.get("/", (req, res) => {
    res.send("hi")
  })

  app.use(checkUser)
  app.use(categoryGroupRouter)
  app.use(categoryRouter)
  app.use(transactionRouter)
  app.use(userRouter)
  
  app.use(apiErrorHandler)

  return app
}

export const initializeDataSource = async () => {
  // await AppDataSource.initialize()
  console.log("Connected to the database.")
}
