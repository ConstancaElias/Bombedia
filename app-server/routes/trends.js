const fs = require('fs')
const express = require('express')
var router = express.Router();
const axios = require('axios')
const jwt_decode = require('jwt-decode');
var path = require('path')


const googleTrends = require('google-trends-api');

const utils = require('../utils.js')

const apiServer = utils.apiServer;
const authServer = utils.authServer;
const flaskServer = utils.flaskServer;




// devolver lista de plavras relacionadas
router.get('/', function(req, res, next) {

    var today = new Date();
    var dd = String(today. getDate()). padStart(2, '0');
    var mm = String(today. getMonth() + 1). padStart(2, '0'); //January is 0!
    var yyyy = today. getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    axios.post(flaskServer + '/trends', {"date": today})
    .then(dados =>  {console.log("DADOS " + dados.data)

        if(req.cookies.token) {
                let token = req.cookies.token
                var decoded = jwt_decode(token);
            
                let userMail = decoded['mail']
            
                axios.post(authServer + '/users/' + userMail)
                .then(data => {
                var user = data.data 
                

                res.render('trends', {view: "trends", user: user, words: dados.data, overTime: dados.data, today: today})
            
                })
                .catch(e => console.log("[index /myHomePage] error getting user data" + e))
            }

            else {
               
               /* axios.post(flaskServer + '/trendsTime', {"date": "today"})
                    .then(dados2 =>  {console.log("DADOS " + dados2.data)
                        const data: Plot[] = [{x: [1, 3, 4, 5], y: [3, 12, 1, 4], type: 'line'}];
                        plot(data);
                            res.render('trends', {view: "initial", words: dados.data, overTime: dados2.data})
                            
                        })
                    .catch(e => console.log("erro ao aceder ao flask: " + e))*/
                    res.render('trends', {view: "trends", words: dados.data, today: today})
            }
        })
        .catch(e => console.log("erro ao aceder ao flask: " + e))
   })


// devolver lista de temas mais procurados numa determinada data
router.post('/', function(req, res, next) {
    let date = req.body.date
    axios.post(flaskServer + '/trends', {"date": date})
    .then(dados =>  {console.log("DADOS " + dados.data)


        if(req.cookies.token) {
            let token = req.cookies.token
            var decoded = jwt_decode(token);
        
            let userMail = decoded['mail']
        
            axios.post(authServer + '/users/' + userMail)
            .then(data => {
            var user = data.data 
            

            res.render('trends', {view: "trends", words: dados.data, user: user})
        
            })
            .catch(e => console.log("[index /myHomePage] error getting user data" + e))
        }
        else {
            res.render('trends', {view: "trends", words: dados.data})
        }
    })
    .catch(e => console.log("erro ao aceder ao flask: " + e))
})

// devolver lista de temas mais procurados numa determinada data
router.get('/trendsTime', function(req, res, next) {
    let date = req.body.date
    axios.get(flaskServer + '/trends', {"date": date})
    .then(dados =>  {console.log("DADOS " + dados.data)


        if(req.cookies.token) {
            let token = req.cookies.token
            var decoded = jwt_decode(token);
        
            let userMail = decoded['mail']
        
            axios.post(authServer + '/users/' + userMail)
            .then(data => {
            var user = data.data 
            

            res.render('trends', {view: "trendings", words: dados.data, user: user, figname: dados.data})
        
            })
            .catch(e => console.log("[index /myHomePage] error getting user data" + e))
        }
        else {
            axios.get(flaskServer + '/trendsTime')
                .then(dados2 => {
                    console.log("FIGNAME ", dados2.data)
                    res.render('trends', {view: "trendings", words: dados.data, figname: dados2.data})
                })
                .catch(console.log("ERROR"))
           
        }
    })
    .catch(e => console.log("erro ao aceder ao flask: " + e))
})

// devolver lista de temas mais procurados numa determinada data
router.post('/trendsTime', function(req, res, next) {
    let tema = req.body.tema
    axios.post(flaskServer + '/trendsTime', {"tema": tema})
    .then(dados =>  {console.log("DADOS " + dados.data)


        if(req.cookies.token) {
            let token = req.cookies.token
            var decoded = jwt_decode(token);
        
            let userMail = decoded['mail']
        
            axios.post(authServer + '/users/' + userMail)
            .then(data => {
            var user = data.data 
            

            res.render('trends', {figname: dados.data, user: user})
        
            })
            .catch(e => console.log("[index /myHomePage] error getting user data" + e))
        }
        else {
            res.render('trends', {figname: dados.data})
        }
    })
    .catch(e => console.log("erro ao aceder ao flask: " + e))
})

module.exports = router;