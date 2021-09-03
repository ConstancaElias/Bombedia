
const fs = require('fs')
const express = require('express')
var router = express.Router();
const axios = require('axios')
const jwt_decode = require('jwt-decode');
var path = require('path')

const utils = require('../utils.js')

const apiServer = utils.apiServer;
const authServer = utils.authServer;
const flaskServer = utils.flaskServer;


// devolver lista de plavras relacionadas
router.get('/', function(req, res, next) {

    if(req.cookies.token) {
        let token = req.cookies.token
        var decoded = jwt_decode(token);
    
        let userMail = decoded['mail']
    
        axios.post(authServer + '/users/' + userMail)
        .then(data => {
          var user = data.data 
          res.render('searchWords', {user: user})
      
        })
        .catch(e => console.log("[index /myHomePage] error getting user data" + e))
      }
    
      else {
      res.render('searchWords')
       }
})


// devolver lista de plavras relacionadas
router.post('/', function(req, res, next) {
  
    if (req.body.word){
      var word = req.body.word
      let type = req.body.type

      
      if (type == "Positive") {
        type = "positive"
      }
      
      else {
        type = "negative"
      }

      console.log(word)

      axios.post(flaskServer + '/searchWords', {"word" : word, "sentiment": type})
      .then(dados =>  {console.log("DADOS " + dados.data)

        if (type == "positive") {
          type = "positivas"
        }

        else {
          type = "negativas"
        }

        if (dados.data.length > 0) {
          var words = dados.data.substr(1, dados.data.length - 2).split(',')
          console.log(words)
          for (var i = 0; i < words.length; i++){
            if(i == 0){
              words[i] = words[i].substr(1, words[i].length - 2)
            }
            else {
              words[i] = words[i].substr(2, words[i].length - 3)
            }
            
          }

        }

        else {
          var words = []
        }
        
        if(req.cookies.token) {
            let token = req.cookies.token
            var decoded = jwt_decode(token);
        
            let userMail = decoded['mail']
        
            axios.post(authServer + '/users/' + userMail)
            .then(data => {
              var user = data.data 
              
              if (words.length > 0) {
                console.log("HEREE")
                res.render('searchWords_results', {view: "reativeWords", word: word, words: words,  sentiment: type,user: user})
            
              }
              else {
                res.render('searchWords_results', {view: "noWords", word: word, words: words,  sentiment: type,user: user})
          
              }
              
            })
            .catch(e => console.log("[index /myHomePage] error getting user data" + e))
          }

          else {
            if (words.length > 0) {
              console.log("HEeey")
              res.render('searchWords_results', {view: "reativeWords", word: word, words: words,  sentiment: type})
          
            }
            else {
              console.log("WORD: ", word)
              res.render('searchWords_results', {view: "noWords", word: word, words: words,  sentiment: type})
        
            }
          }
        })
        .catch(e => console.log("[POST /Search] " + e))
    }
  })
module.exports = router;