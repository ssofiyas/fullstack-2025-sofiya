import express from 'express'
import mongoose from 'mongoose'
import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'
import blogsRouter from './controllers/blogs.js'

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

// kevyt test-reitti (voit korvata oikealla notes-routerilla)
app.get('/api/notes', (request, response) => {
  response.json([])
})

// kaikki blogireitit hoitaa controllers/blogs.js
app.use('/api/blogs', blogsRouter)

// virhe- ja tuntematon endpoint viimeiseksi
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app