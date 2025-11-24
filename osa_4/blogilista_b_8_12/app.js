// ...existing code...
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

// Reitit ennen unknownEndpoint
app.get('/api/notes', (request, response) => {
  // testien vuoksi voi palauttaa tyhjän taulukon tai oikeasti hakea DB:stä
  response.json([])
})

app.use('/api/blogs', blogsRouter)

// Virhe- ja tuntematon endpoint viimeiseksi
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
// ...existing code...