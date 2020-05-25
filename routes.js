const express = require('express')
const routes = express.Router()
const  orcamentos =  require('./controllers/orcamentos')

routes.get('/', function(req, res) {
    return res.redirect("/orcamentos")
})

module.exports = routes 

//== INSTRUCTORS ==

routes.get('/orcamentos', orcamentos.index)

//Rota para CRIAR novo orçamento
routes.get('/orcamentos/create', orcamentos.create)

//Criando rota para LISTAR (show)
routes.get('/orcamentos/:id', orcamentos.show)

//Rota para EDITAR instrutor
routes.get('/orcamentos/:id/edit', orcamentos.edit)

//Configurando rota para trazer os dados do formulário para o backend
routes.post("/orcamentos", orcamentos.post) 

routes.put("/orcamentos", orcamentos.put )

//deletar
routes.delete("/orcamentos", orcamentos.delete)


