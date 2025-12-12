const notesRouter = require('express').Router()
const Note = require('../models/note') 
const mongoose = require('mongoose')

notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({})
  res.json(notes)
})

notesRouter.post('/', async (req, res) => {
  const { content, important } = req.body

  if (!content) {
    return res.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content,
    important: important || false
  })

  const savedNote = await note.save()
  res.status(201).json(savedNote)
})

notesRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { content, important } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'malformatted id' })
  }

  const updatedNote = await Note.findByIdAndUpdate(
    id,
    { content, important },
    { new: true }
  )

  if (updatedNote) {
    res.json(updatedNote)
  } else {
    res.status(404).end()
  }
})

module.exports = notesRouter
