import express from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/user.js'

const usersRouter = express.Router()

// GET /api/users - listaa kaikki käyttäjät (ilman passwordHash takasin)
usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({})
    response.json(users)
  } catch (error) {
    next(error)
  }
})

// POST /api/users - luo uusi käyttäjä
usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    // Validointi - username ja password pitää olla vähintään 3 merkkiä
    if (!username || username.length < 3) {
      return response.status(400).json({ error: 'username must be at least 3 characters long' })
    }
    if (!password || password.length < 3) {
      return response.status(400).json({ error: 'password must be at least 3 characters long' })
    }

    // Tarkista, että käyttäjänimi ei ole jo käytössä
    const existing = await User.findOne({ username })
    if (existing) {
      return response.status(400).json({ error: 'username must be unique' })
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
 