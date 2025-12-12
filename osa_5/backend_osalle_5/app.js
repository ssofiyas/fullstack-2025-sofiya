require('express-async-errors')
const express = require('express')
const mongoose = require('mongoose')
const notesRouter = require('./controllers/notes') 
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error.message))

app.use(express.json())


app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)


app.use('/api/notes', notesRouter) 

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
