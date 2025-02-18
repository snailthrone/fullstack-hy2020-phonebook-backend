require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

const logger = morgan((tokens, req, res) => (
  [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    ...(
      tokens.method(req, res) === 'POST' ? [JSON.stringify(req.body)] : []
    )
  ].join(' ')
))

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(logger)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})

app.post('/api/persons', (request, response, next) => {
  const person = request.body

  new Person(person).save()
    .then(result => response.send(result))
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body
  Person.findOneAndUpdate(request.params.id, { number }, { new: true })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(result => response.json(result))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id)
  Person.findByIdAndRemove(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.countDocuments({}).then((val) => {
    const dateUTC = new Date().toString()
    response.send(
      `
        <p>Phonebook has info for ${val} people.</p>
        <p>${dateUTC}</p>
      `
    )
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'id not found' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))