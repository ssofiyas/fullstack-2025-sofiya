const initialState = []

export const voteAnecdote = (id) => ({
  type: 'VOTE',
  payload: id
})

export const createAnecdote = (content) => ({
  type: 'NEW_ANECDOTE',
  payload: { content, votes: 0, id: Math.random().toString(36).substring(2) }
})

const anecdoteReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'VOTE':
      return state
        .map(a => a.id === action.payload ? { ...a, votes: a.votes + 1 } : a)
        .sort((a, b) => b.votes - a.votes)
    case 'NEW_ANECDOTE':
      return [...state, action.payload]
    default:
      return state
  }
}

export default anecdoteReducer
