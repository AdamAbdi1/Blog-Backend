// const User = require('../models/users.js')
// const Blog = require('../models/blog.js')
// const router = express.router()
// const express = require('express')

// router.get('/new', (req, res) => {
//     User.find({}, (err, allUsers)=> {
//         res.json(allUsers)
//     })
// })

// router.post('/', (req, res) => {
//     User.findById(req.body.userId, (err, foundUser) =>{ 
//         Blog.create(req.body, (err, createdBlog)=> {
//             foundUser.blogs.push(createdBlog)
//             foundUser.save((err, data)=> {
//                 res.redirect('/dashboard')
//             })
//         })
//     })
// })

// router.get('/:id', (req,res)=> {
//     Blog.findById(req.params.id, (err, foundBlog) => {
//         User.findOne({'blogs._id':req.params.id}, (err, foundUser) => {
//             res.json(foundUser)
//         })
//     })
// })

