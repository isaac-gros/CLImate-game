import cors from 'cors'
import express from 'express'
import * as dotenv from "dotenv"

dotenv.config({ path: __dirname +'/../.env' })
const { APP_PORT } = process.env

const app = express()
app.use(cors())
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`))
