import { test, describe, beforeEach, after } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js' // oletan että test_helper eksporttaa initial data
import User from '../models/user.js'

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    // tyhjennetään ja asetetaan alkutila
    await User.deleteMany({})
    const user = new User({
      username: 'root',
      name: 'Super User',
      passwordHash: await (await import('bcryptjs')).default.hash('sekret', 10)
    })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({})
    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const newUser = {
      username: 'root', // olemassa
      name: 'Superuser 2',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'username must be unique')

    const usersAtEnd = await User.find({})
  
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('fails if username is too short', async () => {
    const newUser = { username: 'ab', name: 'Shorty', password: 'validpass' }

    const res = await api.post('/api/users').send(newUser).expect(400)
    assert.strictEqual(res.body.error, 'username must be at least 3 characters long')

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('fails if password is too short', async () => {
    const newUser = { username: 'validname', name: 'NoPass', password: 'pw' }

    const res = await api.post('/api/users').send(newUser).expect(400)
    assert.strictEqual(res.body.error, 'password must be at least 3 characters long')

    const usersAtEnd = await User.find({}) // ei lisaysta
    assert.strictEqual(usersAtEnd.length, 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
