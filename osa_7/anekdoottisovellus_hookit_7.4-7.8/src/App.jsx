import { useState } from 'react'
import {
  Routes, Route, Link, useParams, useNavigate
} from 'react-router-dom'
import './App.css'

// custom hook:t
const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}


const Menu = () => {
  const padding = { paddingRight: 5 }
  return (
    <nav className="nav-menu">
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </nav>
  )
}

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(a => a.id === Number(id))
  if (!anecdote) return <div>Anecdote not found</div>
  
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
      )}
    </ul>
  </div>
)

const CreateNew = (props) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')
  
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/')
  }

  // Tehtävä 7.5 
  const handleReset = (e) => {
    e.preventDefault()
    content.reset()
    author.reset()
    info.reset()
  }

  // Tehtävä 7.6
  const omitReset = (field) => {
    const { reset, ...rest } = field
    return rest
  }

  return (
    <div className="create-form">
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          content 
          <input {...omitReset(content)} /> 
        </div>
        <div className="input-group">
          author 
          <input {...omitReset(author)} />
        </div>
        <div className="input-group">
          url for more info 
          <input {...omitReset(info)} />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">create</button>
          <button type="button" className="reset-button" onClick={handleReset}>reset</button>
        </div>
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
    setNotification(`a new anecdote ${anecdote.content} created!`)
    setTimeout(() => setNotification(''), 5000)
  }

  return (
    <div className="main-container">
      <h1>Software anecdotes</h1>
      <Menu />
      {notification && <div className="notification">{notification}</div>}
      
      <Routes>
        <Route path="/anecdotes/:id" element={<Anecdote anecdotes={anecdotes} />} />
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<div>About anecdote app
        According to Wikipedia:
        An anecdote is a brief, revealing account of an individual person or an incident...
        Software engineering is full of these small stories that teach us how to build better systems.</div>} />
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
      </Routes>

      <footer className="footer">
        <p>Anecdote app for Full Stack Open.</p>
        <p>Here is my repo: <a href="https://github.com/ssofiyas/fullstack-2025-sofiya">github.com/ssofiyas/fullstack-2025-sofiya</a></p>
      </footer>
    </div>
  )
}

export default App