//___________________
//Dependencies
//___________________
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session')
const Blog = require('./models/blog.js')
const jwt = require('jsonwebtoken')
const User = require('./models/users.js');
// const blogsController = require('./controllers/blogs.js')
require('dotenv').config()

const app = express();

app.use(express.json())
app.use(cors())

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3001;


//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI);


app.use(
    session({
        secret: 'secretidhere', //a random string do not copy this value or your stuff will get hacked
        resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
        saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
    })
)

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

// app.use('/blog', blogsController)

//-----------------------------------------------
//      GET SINGLE Blog
//-----------------------------------------------
app.get('/Blogs/:id', (req, res) => {
    Blog.find({}, (err, foundBlog) => {
        res.json(foundBlog)
    })
})

//-----------------------------------------------
//      NEW Blog
//-----------------------------------------------
app.post('/Blogs', (req, res) => {
    Blog.create(req.body, (err, createdBlog) => {
        res.json(createdBlog)
    })
})

//-----------------------------------------------
//      GET ALL BlogS
//-----------------------------------------------
app.get('/Blogs', (req, res) => {
    Blog.find({}, (err, foundBlogs) => {
        res.json(foundBlogs)
    })
})

//-----------------------------------------------
//      DELETE Blog
//-----------------------------------------------
app.delete('/Blogs/:id', (req, res) => {
    Blog.findByIdAndRemove(req.params.id, (err, deletedBlog) => {
        res.json(deletedBlog)
    })
})

//-----------------------------------------------
//      EDIT Blog
//-----------------------------------------------
app.put('/Blogs/:id', (req, res) => {
    Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedBlog) => {
        res.json(updatedBlog)
    })
})

app.post('/api/register', async (req, res) => {
    try {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })
        res.json({ status: 'ok' })
    } catch (err) {
        res.json({ status: 'error', error: 'Duplicate Email' })
    }
})

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        password: req.body.password,
    })

    if (user) {
        const token = jwt.sign({
            name: user.name,
            email: user.email
        }, 'secret123')
        return res.json({ status: 'ok', user: token })
    } else {
        return res.json({ status: 'error', user: false })
    }
})

app.get('/api/quote', async (req, res) => {

    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.findOne({ email: email })

        return res.json({ status: 'ok', quote: user.quote })
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.get('/api/blog', async (req, res) => {

    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        const user = await User.findOne({ email: email })
        
        return res.json({ status: 'ok', posts: user.posts.title, posts: user.posts.text })
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/api/blog', async (req, res) => {

    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        await User.updateOne(
            { email: email },
            { $set: { quote: req.body.quote } }
        )

        return res.json({ status: 'ok' })
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/api/quote', async (req, res) => {

    const token = req.headers['x-access-token']
    try {
        const decoded = jwt.verify(token, 'secret123')
        const email = decoded.email
        // await User.updateOne(
        //     { email: email },
        //     { $set: { quote: req.body.quote } }
        // )
        await User.create(req.body, (err, createdBlog) => {
            res.json(createdBlog)
        })
        return res.json({ status: 'ok' })
    } catch (error) {
        console.log(error);
        res.json({ status: 'error', error: 'invalid token' })
    }
})

app.post('/dashboard', (req, res) => {
    User.findById(req.body.UserId, (err, foundUser) => {
        Blog.create(req.body, (err, createdBlog) => {
            foundUser.Blog.push(createdBlog)
            foundUser.save((err, data) => {
                res.redirect('/Dashboard')
            })
        })
    })
})

//___________________
//Listener
//___________________
app.listen(process.env.PORT, () => console.log(process.env.PORT));