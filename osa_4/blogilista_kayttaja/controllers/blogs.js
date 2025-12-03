import express from 'express'
import mongoose from 'mongoose'
import Blog from '../models/blog.js'

const blogsRouter = express.Router()

// Hae kaikki blogit
blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  } catch (error) {
    next(error)
  }
})

// Hae yksittäinen blogi ID:n perusteella
blogsRouter.get('/:id', async (request, response, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ error: 'invalid id' })
    }

    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

// Lisää uusi blogi
blogsRouter.post('/', async (request, response, next) => {
  try {
    const { title, author, url, likes } = request.body

    if (!title || !url) {
      return response.status(400).json({ error: 'title and url required' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
    })

    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

// Poista blogi
blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ error: 'invalid id' })
    }

    const blog = await Blog.findByIdAndDelete(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// Päivitä blogi (esim. likes)
blogsRouter.put('/:id', async (request, response, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
      return response.status(400).json({ error: 'invalid id' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      request.body,
      { new: true, runValidators: true }
    )

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

export default blogsRouter