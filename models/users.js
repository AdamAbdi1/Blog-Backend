const mongoose = require('mongoose')
const Blog = require('./blog.js')


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: {type: String, required: true, unique: true},
  quote: {type: String},
  post: [{
    title: String,
    text: String
  }]
}, {collection: 'user-data'})

const User = mongoose.model('UserData', userSchema)

module.exports = User