import cors from 'cors'
import express, { Router, json } from 'express'
import * as dotenv from "dotenv"
import { fileSystemRouter } from './routes/FileSystem'
import { directoryRouter } from './routes/Directory'
import { fileRouter } from './routes/File'

dotenv.config({ path: __dirname +'/../.env' })
const { APP_PORT } = process.env

const app = express()
const router = Router()
app.use(cors())
app.use(json())

// Routes
router.use('/filesystem', fileSystemRouter)
router.use('/directory', directoryRouter)
router.use('/file', fileRouter)

app.use(router)
app.listen(APP_PORT, () => console.log(`Listening on port ${APP_PORT} !`))
