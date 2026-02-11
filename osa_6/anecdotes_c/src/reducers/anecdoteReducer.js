import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload.id
      const anecdoteToChange = state.find(a => a.id === id)

      const changed = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }

      return state
        .map(a => a.id !== id ? a : changed)
        .sort((a,b) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a,b) => b.votes - a.votes)
    }
  }
})

export const { voteAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions

// 6.16
export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

// 6.17
export const createAnecdoteAsync = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

// 6.18
export const voteAnecdoteAsync = (anecdote) => {
  return async dispatch => {
    const updated = { ...anecdote, votes: anecdote.votes + 1 }
    await anecdoteService.update(updated)
    dispatch(voteAnecdote(anecdote))
  }
}

export default anecdoteSlice.reducer
