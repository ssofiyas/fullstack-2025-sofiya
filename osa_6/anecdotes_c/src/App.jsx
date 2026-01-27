import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setAnecdotes } from './reducers/anecdoteReducer'
import anecdoteService from './services/anecdotes'

import AnecdoteForm from './components/AnecdoteForm'
import Anecdotes from './components/Anecdotes'
import Notification from './components/Notification'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    anecdoteService.getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
  }, [dispatch])

  return (
    <div>
      <h1>Anecdotes</h1>
      <Notification />
      <AnecdoteForm />
      <Anecdotes />
    </div>
  )
}

export default App
