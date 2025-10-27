const express = require('express')
const cors = require('cors')
const notesRouter = require('./routes/notes')
const { requestLogger, unknownEndpoint, errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())
app.use(requestLogger)

// tiet
app.use('/api/notes', notesRouter)

// virheiden kasittely
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
