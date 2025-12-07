import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const api = supertest(app)

describe('Blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash
    })
    await user.save()

    const blogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: user._id
    }))
    await Blog.insertMany(blogsWithUser)
  })

  describe('GET /api/blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs have id property (not _id)', async () => {
      const response = await api.get('/api/blogs')
      const blog = response.body[0]
      assert(blog.id)
      assert(!blog._id)
    })
  })

  describe('POST /api/blogs', () => {
    test('a valid blog can be added with valid token', async () => {
      const user = await User.findOne({ username: 'root' })
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const newBlog = {
        title: 'Async/await patterns',
        author: 'John Doe',
        url: 'https://example.com/async',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('Async/await patterns'))
    })

    test('adding a blog fails with 401 if token is not provided', async () => {
      const newBlog = {
        title: 'No Token Blog',
        author: 'Unauthorized User',
        url: 'https://example.com/notoken',
        likes: 5,
      }

      const result = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('token'))

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('if likes is missing, default to 0', async () => {
      const user = await User.findOne({ username: 'root' })
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const newBlog = {
        title: 'No likes blog',
        author: 'Jane Doe',
        url: 'https://example.com/nolikes',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(b => b.title === 'No likes blog')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails if title is missing', async () => {
      const user = await User.findOne({ username: 'root' })
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const newBlog = {
        author: 'John Doe',
        url: 'https://example.com/notitle',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails if url is missing', async () => {
      const user = await User.findOne({ username: 'root' })
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const newBlog = {
        title: 'No URL blog',
        author: 'Jane Doe',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('succeeds with status 204 if id is valid and user is creator', async () => {
      const user = await User.findOne({ username: 'root' })
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status 401 if token is not provided', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    })

    test('fails with status 404 if blog does not exist', async () => {
      const user = await User.findOne({ username: 'root' })
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const validNonexistingId = await helper.nonExistingBlogId()

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(404)
    })

    test('fails with status 400 if id is invalid', async () => {
      const user = await User.findOne({ username: 'root' })
      const userForToken = {
        username: user.username,
        id: user._id
      }
      const token = jwt.sign(userForToken, process.env.SECRET)

      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .delete(`/api/blogs/${invalidId}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
    })
  })

  describe('PUT /api/blogs/:id', () => {
    test('succeeds updating likes with valid data', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 5,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      const updated = blogsAtEnd.find(b => b.id === blogToUpdate.id)
      assert.strictEqual(updated.likes, blogToUpdate.likes + 5)
    })

    test('fails with status 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingBlogId()
      const updatedBlog = { title: 'Updated', likes: 10 }

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send(updatedBlog)
        .expect(404)
    })

    test('fails with status 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      const updatedBlog = { title: 'Updated', likes: 10 }

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedBlog)
        .expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
