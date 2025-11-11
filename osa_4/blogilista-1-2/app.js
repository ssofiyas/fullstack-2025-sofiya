import express from 'express'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import { requestLogger, unknownEndpoint, errorHandler } from './utils/middleware.js'
import blogsRouter from './controllers/blogs.js'

const app = express()

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
  .then(() => { logger.info('connected to MongoDB') })
  .catch(error => { logger.error('error connection to MongoDB:', error.message) })

app.use(express.json())
app.use(requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

export default app
