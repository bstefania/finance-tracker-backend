import * as dotenv from "dotenv"
dotenv.config()
import { createServer, initializeDataSource } from "./server"

const app = createServer()
const port = process.env.PORT || 8080

initializeDataSource().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})
