const mongoose = require('mongoose')


const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://fso:${password}@cluster0.qqesy.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length == 3) {
    Person
        .find({})
        .then(result => {
            result.forEach(person => {
                console.log(person);
            })
            console.log('Displaying entries');
            mongoose.connection.close()
            process.exit(0)
        })
} else {
    const person = new Person({
        name: newName,
        number: newNumber
    })

    person.save().then(result => {
        console.log('Person saved!');
        mongoose.connection.close()
    })
}