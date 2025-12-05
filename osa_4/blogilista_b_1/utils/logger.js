// ...existing code...
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

const warn = (...params) => {
  console.warn(...params)
}

// ...existing code...

export default {
  info,
  error,
  warn,
}