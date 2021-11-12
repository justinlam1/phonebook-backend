require('dotenv').config() // enables use of .env file

const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/person') // MongoDB model

app.use(express.json())

var morgan = require('morgan')
const note = require('../notes-backend/models/note')

morgan.token('body', function getData(req) {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(cors())
app.use(express.static('build'))

let persons = [
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
    },
    {
        "name": "test",
        "number": "21",
        "id": 6
    },
    {
        "name": "lol",
        "number": "6",
        "id": 11
    },
    {
        "name": "lollipop",
        "number": "123",
        "id": 12
    }
]

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
})

const generateId = () => {
    return Math.floor(Math.random() * 999999999)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    }

    if (persons.some(person => person.name === body.name)) {
        return response.status(400).json({
            error: "name must be unique"
        })
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
        id: generateId()
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

})

app.get('/info', (request, response) => {
    response.send(`
    <p>Phonebook has info for ${persons.length} people.</p>
    <p>${Date()}</p>
    `)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})