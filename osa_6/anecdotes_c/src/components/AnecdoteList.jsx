import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const Anecdotes = () => { 
  const anecdotes = useSelector(state => state.anecdotes) 
  const dispatch = useDispatch()

  function AnecdoteList() {
    const dispatch = useDispatch()
    const { anecdotes, filter } = useSelector(state => state)

    const filtered = anecdotes.filter(a => a.content.toLowerCase().includes(filter.toLowerCase())
    )

    const handleVote = (anecdote) => {
      dispatch(voteAnecdote(anecdote.id))
      dispatch(setNotification(`you voted '${anecdote.content}'`))
      setTimeout(() => {
        dispatch(clearNotification())
      }, 5000)
    }

    return (
      <ul>
        {notes.map(note => (
          <li key={note.id}>
            {note.content}
            <button onClick={() => dispatch(toggleImportanceOf(note.id))}>
              {note.important ? 'Make not important' : 'Make important'}
            </button>
          </li>
        ))}
      </ul>
    )
  }
}

export default AnecdoteList
