var express = require('express');
var router = express.Router();
var axios = require('axios')
const { v4: uuidv4 } = require('uuid');
// Rota responsavel por criar um formulario, submter o formulario ao modelo e retornar um resultado.
const jwt_decode = require('jwt-decode');

const utils = require('../utils.js');

const apiServer = utils.apiServer;
const authServer = utils.authServer;
const flaskServer = utils.flaskServer;

const request = require('request');

// GET /analyse/
router.get('/', (req,res) =>{

    if(req.cookies.token) {
      let token = req.cookies.token
      var decoded = jwt_decode(token);

      let userMail = decoded['mail']

      axios.post(authServer + '/users/' + userMail)

      // No caso de estar registado
      .then(data => {
        var user = data.data 
        res.render('analyse', {user: user, view: "text"})})
        .catch(e => console.log("[index /myHomePage] error getting user data" + e))
        
      }
    
    else{
      res.render('analyse', {view: "text"})
    }
})



router.post('/', (req, res) => {

  let post_text = req.body.post

  let now = new Date()
  let month = ["01","02","03","04","05","06","07", "08", "09", "10", "11", "12"]
  let day =  now.getFullYear()+ "-" + month[now.getMonth()] + "-" + now.getDate()
 
  
  var time = new Date();

// Fazer o pedido ao servidor flask
  axios.post(flaskServer + '/analyse', {"post_text" : post_text})
  .then(
    dados =>  {console.log("DADOS " + dados.data)

    let sentiment = dados.data;
    console.log("Sentiment ", sentiment)
    let reaction = "Controverso"
    if (sentiment == "Neutral"){
      reaction = "Não Controverso"
    }

    if(sentiment == "Neutral"){
      sentiment = "Neutro"
    }

    else if (sentiment == "Positive"){
      sentiment = "Positivo"
    }

    else {
      sentiment = "Negativo"
    }

  
    let post_id = uuidv4();

    // -------------------------------------- Fazer o pedido dos dados do user.
      if(req.cookies.token) {
        let token = req.cookies.token
        var decoded = jwt_decode(token);

        let userMail = decoded['mail']

        axios.post(authServer + '/users/' + userMail)
        .then(data => { // No caso de estar registado
          var user = data.data 
          
          let post = {
            id: post_id,
            text: post_text,
            date: day,
            time: time.getHours() + ":" + time.getMinutes()  + ":" + time.getSeconds(),
            user_name: user.mail,
            classification: sentiment    // Tem de se submeter aqui o resultado do modelo
          }
      
          console.log("no if " + user)
      
      
          // Adicionar a base de dados
          // Assim é possivel no futuro sugerir palavras  relacionadas para tornar ainda mais reativo. 
          axios.post(apiServer + '/posts/addPost?token=' + req.cookies.token , {"post" :post})
          .then(dados =>  {console.log("DADOS " + dados); res.render('analyse_results', {user: user,  id: post.id, sentiment: sentiment, reaction: reaction, view: "text"})})
          .catch(e => console.log("erro ao inserir o post" + e))
          
        })
        .catch(e => console.log("[index /myHomePage] error getting user data" + e))
      }

      // No caso do user nao estar registado
      else {
        let post = {
          id: post_id,
          text: post_text,
          date: day,
          time: time.getHours() + ":" + time.getMinutes()  + ":" + time.getSeconds(),
          user_name: "undefined",
          classification: sentiment    // Tem de se submeter aqui o resultado do modelo
        }
    
        
    
    
        // Adicionar a base de dados
          // Assim é possivel no futuro sugerir palavras  relacionadas para tornar ainda mais reativo. 
          axios.post(apiServer + '/posts/addPost?token=' + req.cookies.token , {"post" :post})
          .then(dados =>  {console.log("DADOS " + dados); res.render('analyse_results', {id: post.id, sentiment: sentiment, reaction: reaction, view: "text"})})
          .catch(e => console.log("erro ao inserir o post" + e))
      }
    })
  .catch(e => console.log("erro ao aceder ao flask" + e))
})    

router.get('/url', (req, res) => {
  // -------------------------------------- Fazer o pedido dos dados do user.
  if(req.cookies.token) {
    let token = req.cookies.token
    var decoded = jwt_decode(token);

    let userMail = decoded['mail']

    axios.post(authServer + '/users/' + userMail)
    .then(data => { // No caso de estar registado
      var user = data.data 
      
      
  
      res.render('analyse', {user: user,  view: "url"})
      
    })
    .catch(e => console.log("[index /myHomePage] error getting user data" + e))
  }

  // No caso do user nao estar registado
  else {
    res.render('analyse', {view: "url"})
  }
})

router.post('/url', (req, res) => {
  let url = req.body.url
    
  let now = new Date()
  let month = ["01","02","03","04","05","06","07", "08", "09", "10", "11", "12"]
  let day =  now.getFullYear()+ "-" + month[now.getMonth()] + "-" + now.getDate()
 
  
  var time = new Date();

// Fazer o pedido ao servidor flask
  axios.post(flaskServer + '/url', {"url" : url})
  .then(
    dados =>  {console.log("DADOS " + dados.data)

    let sentiment = dados.data;
    if (sentiment == "") {
      res.render('myError', {view: "url_invalid"})
    }

    else {
      console.log("Sentiment ", sentiment)
      let reaction = "Controverso"
      if (sentiment == "Neutral"){
        reaction = "Não Controverso"
      }

      if(sentiment == "Neutral"){
        sentiment = "Neutro"
      }

      else if (sentiment == "Positive"){
        sentiment = "Positivo"
      }

      else {
        sentiment = "Negativo"
      }
    
      let post_id = uuidv4();

      // -------------------------------------- Fazer o pedido dos dados do user.
        if(req.cookies.token) {
          let token = req.cookies.token
          var decoded = jwt_decode(token);

          let userMail = decoded['mail']

          axios.post(authServer + '/users/' + userMail)
          .then(data => { // No caso de estar registado
            var user = data.data 
            
            let post = {
              id: post_id,
              text: "", //TODO_tratar isto
              date: day,
              time: time.getHours() + ":" + time.getMinutes()  + ":" + time.getSeconds(),
              user_name: user.mail,
              classification: sentiment    // Tem de se submeter aqui o resultado do modelo
            }
        
            console.log("no if " + user)
        
        
            // Adicionar a base de dados
            // Assim é possivel no futuro sugerir palavras  relacionadas para tornar ainda mais reativo. 
            axios.post(apiServer + '/posts/addPost?token=' + req.cookies.token , {"post" :post})
            .then(dados =>  {console.log("DADOS " + dados); res.render('analyse_results', {user: user,  id: post.id, sentiment: sentiment, reaction: reaction})})
            .catch(e => console.log("erro ao inserir o post" + e))
            
          })
          .catch(e => console.log("[index /myHomePage] error getting user data" + e))
        }

        // No caso do user nao estar registado
        else {
          let post = {
            id: post_id,
            text: "", //TODO_tratar isto
            date: day,
            time: time.getHours() + ":" + time.getMinutes()  + ":" + time.getSeconds(),
            user_name: "undefined",
            classification: sentiment    // Tem de se submeter aqui o resultado do modelo
          }
      
          
      
      
          // Adicionar a base de dados
            // Assim é possivel no futuro sugerir palavras  relacionadas para tornar ainda mais reativo. 
            axios.post(apiServer + '/posts/addPost?token=' + req.cookies.token , {"post" :post})
            .then(dados =>  {console.log("DADOS " + dados); res.render('analyse_results', {id: post.id, sentiment: sentiment, reaction: reaction})})
            .catch(e => console.log("erro ao inserir o post" + e))
        }
      }
      })
    .catch(e => console.log("erro ao aceder ao flask" + e))
    
    
})   


module.exports = router;