import { test, after, beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import mongoose from 'mongoose'
import supertest from 'supertest'
import app from '../app.js'
import helper from './test_helper.js'
import Blog from '../models/blog.js'

const api = supertest(app)

describe('Blog API', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Async/await patterns',
        author: 'John Doe',
        url: 'https://example.com/async',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(titles.includes('Async/await patterns'))
    })

    test('if likes is missing, default to 0', async () => {
      const newBlog = {
        title: 'No likes blog',
        author: 'Jane Doe',
        url: 'https://example.com/nolikes',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

      const blogsAtEnd = await helper.blogsInDb()
      const addedBlog = blogsAtEnd.find(b => b.title === 'No likes blog')
      assert.strictEqual(addedBlog.likes, 0)
    })

    test('fails if title is missing', async () => {
      const newBlog = {
        author: 'John Doe',
        url: 'https://example.com/notitle',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails if url is missing', async () => {
      const newBlog = {
        title: 'No URL blog',
        author: 'Jane Doe',
        likes: 5,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })

  describe('DELETE /api/blogs/:id', () => {
    test('succeeds with status 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

      const titles = blogsAtEnd.map(b => b.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fails with status 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId()
      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .expect(404)
    })

    test('fails with status 400 if id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
      await api
        .delete(`/api/blogs/${invalidId}`)
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
      const validNonexistingId = await helper.nonExistingId()
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