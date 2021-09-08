const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect("mongodb+srv://william:williamhenryceo@cluster0.y2twp.mongodb.net/node-angular?retryWrites=true&w=majority")
.then(() => {
    console.log("Connected to database")
}).catch(() => {
    console.log("Connection Failed")
})


const Post = require('./models/post');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*")
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept")
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS")
    next(); //lets us move on to the next middleware
})

app.post('/api/posts', (req, res, next) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    })
    post.save().then((result) => {
        console.log(result)
        // console.log(post)
        res.status(201).json({
            message: "Post added successfully",
            postId: result._id
        })
    })
})

app.get('/api/posts', (req, res, next ) => {
    Post.find()
    .then((documents) => {
        res.status(200).json({ 
            message: "Fetch Successfull",
            posts: documents
         })
    })
})

app.delete(`/api/posts/:id`, (req, res, next) => {
    Post.deleteOne({ _id: req.params.id })
    .then((result) => {
        console.log(result)
        res.status(200).json({ message: "Post has been deleted" })
    })
})

module.exports = app