import Blog from '../models/blog.js'
import Note from '../models/note.js'

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

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
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

const nonExistingNoteId = async () => {
  const note = new Note({ content: 'willremovethissoon', important: false })
  await note.save()
  await Note.findByIdAndDelete(note._id)
  return note._id.toString()
}

export default {
  initialBlogs,
  initialNotes,
  blogsInDb,
  notesInDb,
  nonExistingBlogId,
  nonExistingNoteId,
  nonExistingId: nonExistingBlogId
}
