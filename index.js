// const http = require('http')
const express = require('express')
const app = express()

// 3.1: Backend de la Agenda Telefónica paso 1
// Implementa una aplicación Node que devuelva una lista codificada de entradas de la agenda telefónica desde la dirección http://localhost:3001/api/persons.

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
//   const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(persons))
//   })

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
  
// 3.2: Backend de la Agenda Telefónica, paso 2
// Implementa una página en la dirección http://localhost:3001/info que se parezca más o menos a esto:

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)