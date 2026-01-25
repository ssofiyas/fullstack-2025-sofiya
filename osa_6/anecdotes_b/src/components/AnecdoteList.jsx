import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const { anecdotes, filter } = useSelector(state => state)

  const filtered = anecdotes.filter(a =>
    a.content.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {filtered.map(a => (
        <div key={a.id}>
          <div>{a.content}</div>
          <div>
            has {a.votes}
            <button onClick={() => dispatch(voteAnecdote(a.id))}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
