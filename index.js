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

const errorHandler = (error, request, response, next) => {
    console.log(error.message)
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id'})
    }
    next(error)
}

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
    .then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
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

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "content missing"
        })
    }

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })

})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`
        <p>Phonebook has info for ${persons.length} people.</p>
        <p>${Date()}</p>
        `)
    })
    
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})