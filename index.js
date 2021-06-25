const express = require('express')
const app = express()

app.use(express.json())

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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})