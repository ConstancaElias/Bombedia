const express = require('express')
var router = express.Router();
const multer = require('multer')


var Posts = require('../controllers/post')


// Post /posts/addPost

router.post('/addPost', (req,res)=>{
    let post = req.body.post
    console.log(post)

    Posts.insert(post)
    .then(data => {
        console.log("Resource successfully inserted in the database"); 
        res.status(201).jsonp({data: data})
    })
    .catch(err => console.error(err))

})

// ------------------------------------------------------------------------
  
// Retorna a lista de posts
router.get('/', (req, res) => {
   
    Posts.list()
    .then(data => {
        res.status(201).json(data)
    })
    .catch(e => res.status(500).jsonp({err: e}))

})

// Retorna um post dado o seu ID
//Get posts/:id
router.get('/:id', (req, res) => {
    Posts.lookUp(req.params.id)
    .then(data => {
        console.log("post data: " + data.data)
        res.status(201).json(data)
    })
    .catch(e => res.status(500).jsonp({err: e}))

})
module.exports = router;