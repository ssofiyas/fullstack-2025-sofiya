import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import blogsRouter from './controllers/blogs.js'
import usersRouter from './controllers/users.js'
import loginRouter from './controllers/login.js'
import { requestLogger, tokenExtractor, unknownEndpoint, errorHandler } from './utils/middleware.js'
import config from './utils/config.js'

mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor) 

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

app.use('/api/blogs', blogsRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

export default app


