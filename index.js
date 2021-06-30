const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())

var morgan = require('morgan')

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
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
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
    
    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    response.json(person)

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