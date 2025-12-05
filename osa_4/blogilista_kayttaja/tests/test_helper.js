import User from '../models/user.js'
import Blog from '../models/blog.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Sofiya Sakhchisnkaya',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Fullstack Open',
    author: 'Author Name: Fullstack Open',
    url: 'https://fullstackopen.com/',
    likes: 5,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const nonExistingBlogId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'temp',
    url: 'http://temp.com',
    likes: 0,
  })
  await blog.save()
  await Blog.findByIdAndDelete(blog._id)
  return blog._id.toString()
}

const getTokenForUser = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Super User', passwordHash })
  await user.save()

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  return jwt.sign(userForToken, process.env.SECRET || 'secretkey')
}

export default {
  initialBlogs,
  blogsInDb,
  nonExistingBlogId,
  getTokenForUser,
}
