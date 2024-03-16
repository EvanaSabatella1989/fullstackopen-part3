// const http = require('http')
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json());

// Configura Morgan para registrar mensajes en la consola según la configuración 'tiny'
//app.use(morgan('tiny'));

// Configura Morgan para mostrar los datos de las solicitudes POST junto con el registro
app.use(morgan((tokens, req, res) => {
  if (req.method === 'POST') {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ');
  } else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ');
  }
}));

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

app.get('/info', (req, res) => {
  const currentTime = new Date().toString();
  const numberOfEntries = persons.length;
  
  const info = `Phonebook has info for ${numberOfEntries} people <br/> ${currentTime}`;
  
  res.send(info);
});

// 3.3: Backend de la Agenda Telefónica, paso 3
// Implementa la funcionalidad para mostrar la información de una sola entrada de la agenda. La URL para obtener los datos de una persona con la identificación 5 debe ser 
// http://localhost:3001/api/persons/5

// Si no se encuentra una entrada para la identificación dada, el servidor debe responder con el código de estado apropiado.

app.get('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Buscar la persona en la agenda
  const person = persons.find(p => p.id === id);

  if (!person) {
      // Si no se encuentra la persona, responder con código 404
      return res.status(404).json({ error: 'Persona no encontrada' });
  }

  // Si se encuentra la persona, responder con sus datos
  res.json(person);
});


// 3.4: Backend de la Agenda Telefónica, paso 4
// Implementa la funcionalidad que hace posible eliminar una sola entrada de la agenda telefónica mediante una solicitud HTTP DELETE a la URL única de esa entrada de la agenda.

// Prueba que tu funcionalidad funcione con Postman o el cliente REST de Visual Studio Code.

app.delete('/api/persons/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // Buscar la persona en la agenda
  const index = persons.findIndex(p => p.id === id);

  if (index === -1) {
      // Si no se encuentra la persona, responder con código 404
      return res.status(404).json({ error: 'Persona no encontrada' });
  }

  // Eliminar la persona del arreglo de la agenda
  persons.splice(index, 1);

  // Responder con un mensaje de éxito
  res.json({ message: 'Persona eliminada correctamente' });
});


// 3.5: Backend de la Agenda Telefónica, paso 5
// Expande el backend para que se puedan agregar nuevas entradas a la agenda telefónica realizando solicitudes HTTP POST a la dirección http://localhost:3001/api/persons.

// Genera un nuevo id para la entrada de la agenda con la función Math.random. Utiliza un rango lo suficientemente grande para tus valores aleatorios de modo que la probabilidad de crear IDs duplicados sea pequeña.

// Función para validar si el nombre ya existe en la agenda
const isNameAlreadyExists = (name) => {
  return persons.some(person => person.name === name);
};

// Ruta para agregar una nueva entrada a la agenda
app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  // Validar si falta el nombre o el número
  if (!name || !number) {
      return res.status(400).json({ error: 'Falta el nombre o el número en la solicitud' });
  }

  // Validar si el nombre ya existe en la agenda
  if (isNameAlreadyExists(name)) {
      return res.status(400).json({ error: 'El nombre ya existe en la agenda' });
  }

  // Generar un nuevo ID único
  let id;
  do {
      id = Math.floor(Math.random() * 1000000); // Rango lo suficientemente grande para evitar colisiones
  } while (persons.some(person => person.id === id));

  // Agregar la nueva persona a la agenda
  const newPerson = { id, name, number };
  persons.push(newPerson);

  // Responder con los datos de la nueva persona
  res.json(newPerson);
});

// 3.6: Backend de la Agenda Telefónica, paso 6
// Implementa el manejo de errores para crear nuevas entradas. No se permite que la solicitud se realice correctamente si:

// Falta el nombre o el número
// El nombre ya existe en la agenda
// Responde a solicitudes como estas con el código de estado apropiado y también envía información que explique el motivo del error



// 3.7: Backend de la Agenda Telefónica, paso 7
// Agrega el middleware morgan a tu aplicación para el registro de mensajes. Configúralo para registrar mensajes en tu consola según la configuración tiny.
// Morgan se instala como todas las demás librerías con el comando npm install. La puesta en funcionamiento de Morgan ocurre de la misma manera que la configuración de cualquier otro middleware mediante el comando app.use.


// 3.8*: Backend de la Agenda Telefónica, paso 8
// Configura morgan para que también muestre los datos enviados en las solicitudes HTTP POST

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)