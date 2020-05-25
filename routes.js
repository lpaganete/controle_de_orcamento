const express = require('express')
const routes = express.Router()
const  instructors =  require('./controllers/instructors')

routes.get('/', function(req, res) {
    return res.redirect("/instructors")
})

module.exports = routes 

//== INSTRUCTORS ==

routes.get('/instructors', instructors.index)

//Rota para CRIAR instrutor
routes.get('/instructors/create', instructors.create)

//Criando rota para LISTAR (show)
routes.get('/instructors/:id', instructors.show)

//Rota para EDITAR instrutor
routes.get('/instructors/:id/edit', instructors.edit)

//Configurando rota para trazer os dados do formulário para o backend
routes.post("/instructors", instructors.post) 

routes.put("/instructors", instructors.put )

//deletar
routes.delete("/instructors", instructors.delete)


