import * as dotenv from "dotenv"
dotenv.config()
import {createServer} from "./server"
import * as functions from "firebase-functions"

const app = createServer()
const port = process.env.PORT || 8080

app.listen(port, () => {
  console.log(`App listening on http://127.0.0.1:${port}`)
})

export const webApi = functions.https.onRequest(app)
