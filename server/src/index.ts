import cors from 'cors'
import express, { Router, json } from 'express'
import * as dotenv from "dotenv"
import { fileSystemRouter } from './routes/FileSystem'

dotenv.config({ path: __dirname +'/../.env' })
const { APP_PORT } = process.env

const app = express()
const router = Router()
app.use(cors())
app.use(json())

// Routes
router.use('/filesystem', fileSystemRouter)

app.use(router)
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT}`))
