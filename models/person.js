const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log(`Connecting to ${url}`)

mongoose.set('useFindAndModify', false)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(({ message }) => console.log(`Error connecting to MongoDB: ${message}`))

const schema = new mongoose.Schema({
  name: String,
  number: String,
})

schema.set('toJSON', {
  transform: (document, obj) => {
    obj.id = obj._id.toString()
    delete obj._id
    delete obj.__v
  }
})

module.exports = mongoose.model('Person', schema)
