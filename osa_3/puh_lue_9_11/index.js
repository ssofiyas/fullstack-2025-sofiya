import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

app.use(express.static('dist'))

dotenv.config()

const app = express()


app.use(cors())
app.use(express.json())


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const requestLogger = (request, _response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)


const mongoUrl = process.env.MONGODB_URI
if (mongoUrl) {
  console.log('Connecting to MongoDB...')
  mongoose.connect(mongoUrl)
    .then(() => {
      console.log('Connected to MongoDB ✅')
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error.message)
    })
} else {
  console.log('No MongoDB URI found. Running without database ⚙️')
}


let notes = [
  { id: 1, content: 'HTML is easy', important: true },
  { id: 2, content: 'Browser can execute only JavaScript', important: false },
  { id: 3, content: 'GET and POST are the most important methods of HTTP protocol', important: true }
]


app.get('/', (_req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (_req, res) => {
  res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  if (!body.content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = {
    id: Math.floor(Math.random() * 10000),
    content: body.content,
    important: body.important || false
  }

  notes = notes.concat(note)
  res.json(note)
})


const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
