const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  console.error(err.message)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  next(err) // jos virhe ei ole tunnistettu, annetaan seuraavan middleware hoitaa
}

module.exports = {
  unknownEndpoint,
  errorHandler
}

