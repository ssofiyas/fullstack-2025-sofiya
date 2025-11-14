import { useState, useEffect } from 'react'
import blogService from './services/blogs'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    blogService
      .getAll()
      .then(data => {
        setBlogs(data)
      })
      .catch(error => {
        console.error('Error fetching data:', error.message)
        setMessage('Cannot connect to the server.')
        setMessageType('error')
        setTimeout(() => setMessage(null), 4000)
      })
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
      likes: 0
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`Added blog "${newTitle}" by ${newAuthor}`)
        setMessageType('success')
        setTimeout(() => setMessage(null), 4000)
        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      })
      .catch(error => {
        setMessage('Failed to add blog. Please try again.')
        setMessageType('error')
        setTimeout(() => setMessage(null), 4000)
      })
  }

  const deleteBlog = (id) => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      blogService
        .remove(id)
        .then(() => {
          setBlogs(blogs.filter(b => b.id !== id))
          setMessage(`Deleted blog "${blog.title}"`)
          setMessageType('success')
          setTimeout(() => setMessage(null), 4000)
        })
        .catch(error => {
          setMessage(`Blog "${blog.title}" has already been removed from server`)
          setMessageType('error')
          setTimeout(() => setMessage(null), 4000)
          setBlogs(blogs.filter(b => b.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Blog List</h2>

      <Notification message={message} type={messageType} />

      <h3>Add New Blog</h3>
      <form onSubmit={addBlog}>
        <div>
          title: <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        </div>
        <div>
          author: <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} />
        </div>
        <div>
          url: <input value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h3>Blogs</h3>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <strong>{blog.title}</strong> by {blog.author}
            <br />
            <a href={blog.url} target="_blank" rel="noopener noreferrer">{blog.url}</a>
            <br />
            Likes: {blog.likes}
            <button onClick={() => deleteBlog(blog.id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App

