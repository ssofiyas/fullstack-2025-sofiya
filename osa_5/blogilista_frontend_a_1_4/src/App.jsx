import { useState, useEffect } from 'react'
import loginService from './services/login'
import noteService from './services/notes'

const Notification = ({ message }) => {
  if (message === null) return null
  return <div style={{ color: 'red' }}>{message}</div>
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      noteService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong username/password')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const addNote = async (event) => {
    event.preventDefault()
    try {
      const noteObject = { content: newNote, important: false }
      const returnedNote = await noteService.create(noteObject)
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    } catch {
      setErrorMessage('Error creating note')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }

  const toggleImportanceOf = async (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
    try {
      const updatedNote = await noteService.update(id, changedNote)
      setNotes(notes.map(n => n.id !== id ? n : updatedNote))
    } catch {
      setErrorMessage('Error updating note')
      setTimeout(() => setErrorMessage(null), 3000)
    }
  }
//lisays
  noteService.getAll().then(initialNotes => setNotes(initialNotes))
// tasta tule virhe
//  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      {!user && loginForm()}

      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>



    </div>
  )
}

export default App
