const express = require('express')
var router = express.Router();

var Posts = require('../controllers/post')


// Post /search/posts/
router.post('/posts/:userID', (req, res) => {
    
    Posts.listProducer(req.params.userID)
    .then(data => {console.log("data: " + data); res.status(201).json(data)})
    .catch(e => res.status(500).jsonp({err: e}))

        
})


module.exports = router;