import * as dotenv from "dotenv"
dotenv.config()
import { createServer, initializeDataSource } from "./server"

const app = createServer()
const port = process.env.PORT || 8080

initializeDataSource().then(() => {
  app.listen(port, () => {
    console.log(`App listening on http://127.0.0.1:${port}`)
  })
})
