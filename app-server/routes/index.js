var express = require('express');
var router = express.Router();
var axios = require("axios")
const jwt_decode = require('jwt-decode');

const utils = require('../utils.js')
const apiServer = utils.apiServer;
const authServer = utils.authServer;


/* GET home page. */
router.get('/', function(req, res, next) {
  
  res.redirect('/myHomePage')
});


router.get('/myHomePage', function(req, res, next) {

  if(req.cookies.token) {
    let token = req.cookies.token
    var decoded = jwt_decode(token);

    let userMail = decoded['mail']

    axios.post(authServer + '/users/' + userMail)
    .then(data => {
      var user = data.data 
      res.render('initial', {view: "initial", user: user})
  
    })
    .catch(e => console.log("[index /myHomePage] error getting user data" + e))
  }
  else {
    res.render('initial', {view: "initial"})
  }
 
})

router.get('/logout', function(Req, res, next) {
  res.clearCookie('token')
  res.redirect('/')
})


router.get('/profile', function(req, res, next) {
  
  //get user mail
  var token = req.cookies.token
  var decoded = jwt_decode(token);
  let userMail = decoded['mail']
  //----------------------

  if(req.query.user) {
    userMail = req.query.user
  }

  axios.post(authServer + '/users/' + userMail)
  .then(data => {
    var user = data.data
    axios.post(apiServer + '/search/posts/' + userMail + '?token=' + token)
      .then(data => {
        let list = data.data
        res.render("profile", {user: user, posts: list})
      })
      .catch(err => console.log("[index] /logout error getting user posts -- " + err))
    
  })
  .catch(e => console.log("[index] /logout : error getting user data -- " + e))
})


module.exports = router;
