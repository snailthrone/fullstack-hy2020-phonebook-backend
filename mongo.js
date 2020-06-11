const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Give password as an argument')
  process.exit()
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://snailthrone:${password}@fullstack-part3-cdliw.mongodb.net/<dbname>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const schema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', schema)

const person = new Person({
  name,
  number,
})

if (process.argv.length < 4) {
  Person.find({}).then(result => {
    console.log('Phonebook:')
    result.forEach(({ name, number }) => {
      console.log(name, number);
    })
    mongoose.connection.close()
  })
} else {
  person.save().then(response => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}
