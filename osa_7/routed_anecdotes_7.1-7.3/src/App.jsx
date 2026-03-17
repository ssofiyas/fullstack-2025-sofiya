import { useState } from 'react'
import {
  Routes, Route, Link, useParams, useNavigate
} from 'react-router-dom'
import './App.css' 

const Menu = () => {
  return (
    <nav className="nav-menu">
      <Link className="nav-link" to="/">anecdotes</Link>
      <Link className="nav-link" to="/create">create new</Link>
      <Link className="nav-link" to="/about">about</Link>
    </nav>
  )
}

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(a => a.id === Number(id))

  if (!anecdote) return <p>Anecdote not found</p>

  return (
    <div className="anecdote-view">
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has <strong>{anecdote.votes}</strong> votes</p>
      <p>for more info see <a href={anecdote.info} target="_blank" rel="noreferrer">{anecdote.info}</a></p>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul className="anecdote-list">
      {anecdotes.map(anecdote => 
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const About = () => (
  <div className="about-section">
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident...</em>
    <p>Software engineering is full of these small stories that teach us how to build better systems.</p>
  </div>
)

const Footer = () => (
  <footer className="footer">
    <p>
      Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
    </p>
    <p>
      Check my solutions here: <a href='https://github.com/ssofiyas/fullstack-2025-sofiya' target="_blank" rel="noreferrer">github.com/ssofiyas/fullstack-2025-sofiya</a>
    </p>
  </footer>
)

const CreateNew = (props) => {
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [info, setInfo] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content,
      author,
      info,
      votes: 0
    })
    navigate('/')
  }

  return (
    <div className="create-form">
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>content</label>
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>author</label>
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>url for more info</label>
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button type="submit" className="submit-button">create</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    },
    {
    content: 'The best way to get a project done faster is to start sooner.',
    author: 'Jim Horning',
    info: 'https://en.wikiquote.org/wiki/Jim_Horning',
    votes: 0,
    id: 3
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
    setNotification(`A new anecdote "${anecdote.content}" created!`)
    setTimeout(() => {
      setNotification('')
    }, 5000)
  }

  return (
    <div className="main-container">
      <h1>Software Anecdotes</h1>
      <Menu />
      
      {notification && <div className="notification">{notification}</div>}
      
      <main className="content">
        <Routes>
          <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
          <Route path="/about" element={<About />} />
          <Route path="/create" element={<CreateNew addNew={addNew} />} />
          <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App