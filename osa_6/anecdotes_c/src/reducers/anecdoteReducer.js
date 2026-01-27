import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState,
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload
      const anecdote = state.find(a => a.id === id)
      if (anecdote) anecdote.votes += 1
      return state.sort((a,b) => b.votes - a.votes)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer
