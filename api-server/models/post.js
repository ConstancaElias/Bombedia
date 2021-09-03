var mongoose = require('mongoose')


const posts = mongoose.connection.useDb('Posts')



var postSchema = new mongoose.Schema({
    id: String,
    text: String,
    date: String,
    time:String,
    user_name:String,
    classification: String // Reative, noReative   
})


module.exports =  posts.model ('post', postSchema)