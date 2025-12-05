import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

const usersRouter = express.Router()

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', { title: 1, url: 1, likes: 1 })
  res.json(users)
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    if (!username || username.length < 3) {
      return response.status(400).json({ error: 'username must be at least 3 characters long' })
    }
    if (!password || password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

export default usersRouter
