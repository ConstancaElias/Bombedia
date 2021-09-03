var Post = require('../models/post')

// Devolve a lista de posts
module.exports.list = () => {
    return Post.find()
        .sort({date: -1, time:-1})
        .exec()
}

// Encontra um Post pelo id
module.exports.lookUp = id => {
    return Post
        .findOne({id:id})
        .exec()
}


module.exports.insert = (post)  => {
    var p = new Post(post)
    return p.save();
}

//list resources by user_name
module.exports.listProducer = (id)=> {
    return Post
        .find({user_name: id})
        .sort({date: -1, time:-1})
        .exec()
}


//insere um novo post se nao existe. Se exitir faz update
module.exports.insert_update = post => {
    return Post.updateOne({ id: post.id },{ id: post.id, name_file: post.name_file, id_file:post.id_file, description:post.description, date: post.date, time:post.time, user_name:post.user_name, postType:post.postType, comments:post.comments},{ upsert : true } );
    }

    // apaga um recurso dado o seu ID
module.exports.delete = id => {
    console.log("Estou a eliminar")
    return Post.deleteOne({ id: id });
};
