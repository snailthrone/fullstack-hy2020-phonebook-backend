const express = require('express');

const app = express();
const PORT = 3001;

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  }
]

app.use(express.json())

app.get('/api/persons', (request, response) => {
  response.json(persons)
});

app.post('/api/persons', (request, response) => {
  const person = request.body;

  if (persons.some(({ name }) => name === person.name)) {
    response.status(400).json({ error: 'name must be unique'})
  } else if (!person.name) {
    response.status(400).json({ error: 'name cannot be blank' })
  } else if (!person.number) {
    response.status(400).json({ error: 'number cannot be blank' })
  } else {
    const maxId = Math.max(...persons.map(({ id }) => id));
    person.id = randomNumber(maxId, 1000);
    persons = persons.concat(person);
    response.send(person)    
  }
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(person => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
});

app.get('/info', (request, response) => {
  const amount = persons.length;
  const dateUTC = new Date().toString();
  response.send(`
    <p>Phonebook has info for ${amount} people.</p>
    <p>${dateUTC}</p>
  `)
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));