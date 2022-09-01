const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {type: String, required: true},
    text: {type: String, required: true},
    image: String
}, {timestamps: true})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog