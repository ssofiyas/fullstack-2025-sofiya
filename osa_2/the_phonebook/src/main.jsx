import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const notes = [
  { id: 1, content: 'Arto Hellas', important: true },
  { id: 2, content: 'Grace Hopper', important: false },
]
ReactDOM.createRoot(document.getElementById('root')).render(
  <App notes={notes} />
)
