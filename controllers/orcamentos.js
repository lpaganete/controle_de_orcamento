
const fs = require('fs') //importando a funcionalidade  fs
const data = require("../data.json") //pegando o arquivo data.json 
const {somaDespesas} = require('../utils') //importando o objeto age que trata as datas

exports.index = function(req, res) {
    return res.render("orcamentos/index", { orcamentos: data.orcamentos })
}

exports.create = function(req, res) {
    return res.render("orcamentos/create")
}

// *** CREATE ****/
exports.post = function (req, res) {

    //=== VALIDAÇÂO ===
    const keys = Object.keys(req.body) //pega as chaves do array

    for (key of keys) {
        //req.body.avatar_url = ""
        if (req.body[key] == "") {
            return res.send("Please, fill all fields!")
        }
    }

    //desestruturando o req.body. O req.bory são os campos que vieram do form no front-end
    let{
        salario,
        valeAlimentacao,
        rendaExtra,
        month,
        university,
        food,
        telephone,
        educabr,
        creditcard,
        any,
        economy,
    } = req.body //usei a variavel let pois ela pode mudar


    //=== TRATAMENTO DOS DADOS ===//
    birth = Date.parse(req.body.birth) //Mudando o formato da hr para milisegundos e trazendo para o data.json
    const created_at = Date.now() //trazendo a data da hr de criação do cadastro (não existe no front)
    const id = Number(data.orcamentos.length + 1) //criando id para cada objeto. (não existe no front)  

    //=== CALCULOS ===

    const rendaTotal = parseFloat(salario) + parseFloat(valeAlimentacao) + parseFloat(rendaExtra)

   const somaDespesas = parseFloat(university) + parseFloat(food) + parseFloat(telephone) + parseFloat(educabr) + parseFloat(creditcard) + parseFloat(any) + parseFloat(economy)

    const saldo = rendaTotal - somaDespesas

   
    //=== ENVIANDO DADOS PARA DENTRO DO DATA ===//
  
    data.orcamentos.push({
        
        id,
        month,
        salario,
        valeAlimentacao,
        rendaExtra,
        university,
        food,
        telephone,
        educabr,
        creditcard,
        any,
        economy,
        rendaTotal,
        somaDespesas,
        saldo,
        created_at,
               
    }) 

    //Depois de verificar se os campos estão preenchidos ele irá salvar os dados em um arquivo json
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) { //Formatando arquivo data.json
        if (err) return res.send("Write file error!")

        return res.redirect("/orcamentos") //Depois de tudo salvo dentro do data.json, ele retorna para página orcamentos
    }) 
    
}

// *** SHOW ****/
exports.show = function (req, res) { 
    //req.query.id seria com o ?=...
    //req.body
    //req.params utilizando agr

    const {id} = req.params //retirando o id e fazendo com que ele seja uma variável

    const foundOrcamento = data.orcamentos.find(function(orcamento) {
        return orcamento.id == id
    }) 

    if (!foundOrcamento) { //se nao tiver o id que foi solicitado 
        return res.send("Orcamento not found!")
    }

           

    //=== Tratando dados para mandar para o front ===//
    const orcamento = {
        ...foundOrcamento,
        created_at: new Intl.DateTimeFormat("pt-br").format(foundOrcamento.created_at), 
        
    }

    return res.render("orcamentos/show", {orcamento: orcamento})
    


}

 
//*** EDIT (Página para editar) ****/
exports.edit = function(req,res) {

    //reaproveitando estre trecho do show
    const {id} = req.params 

    const foundOrcamento = data.orcamentos.find(function(orcamento) {
        return orcamento.id == id
    }) 

    if (!foundOrcamento) { //se nao tiver o id que foi solicitado 
        return res.send("Orcamento not found!")
    }

    const orcamento = {
        ...foundOrcamento,
        
    }
     
    return res.render("orcamentos/edit", {orcamento})
}

//*** PUT (salvar oq foi editado no back-end) ****/
exports.put = function(req, res) {
    //reaproveitando estre trecho do edit
    const {id} = req.body
    let index = 0

    //verificando se o instrutor foi cadastrado
    const foundOrcamento = data.orcamentos.find(function(orcamento, foundIndex ) {
        if (id == orcamento.id){ //adicionando um index ao objeto
            index = foundIndex
            return true
        }
    }) 
    //se o instrutor não foi cadastrado, ele retorn uma mensagems
    if (!foundOrcamento)   return res.send("Orcamento not found!")
    
    //espalhando dentro do objeto todos os dados que estão no data e todos os dados que estão no req.body (front-end)

    let{
        salario,
        valeAlimentacao,
        rendaExtra,
        month,
        university,
        food,
        telephone,
        educabr,
        creditcard,
        any,
        economy,
    } = req.body //usei a variavel let pois ela pode mudar
        
    const rendaTotal = parseFloat(salario) + parseFloat(valeAlimentacao) + parseFloat(rendaExtra)

    const somaDespesas = parseFloat(university) + parseFloat(food) + parseFloat(telephone) + parseFloat(educabr) + parseFloat(creditcard) + parseFloat(any) + parseFloat(economy)

    const saldo = rendaTotal - somaDespesas
    
    const orcamento = {
        ...foundOrcamento,
        ...req.body,
        salario,
        valeAlimentacao,
        rendaExtra,
        month,
        university,
        food,
        telephone,
        educabr,
        creditcard,
        any,
        economy,
        salario,
        valeAlimentacao,
        rendaExtra,
        rendaTotal,
        somaDespesas,
        saldo,
        id: Number(req.body.id)
    }

    //agora meus  dados estão ok para serem colocados dentro do objjeto de data.js

    data.orcamentos[index] = orcamento //adicionando no data somente o orcamento que eu alterei

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect(`/orcamentos/${id}`) //quando salvar o arquivo ele redireciona para a pagina do instrutor que foi alterado
    })
}

//*** DELETE ****/
exports.delete = function(req, res) {
    const {id} = req.body //pegando o id de dentro do body
    
    const filteredOrcamentos  = data.orcamentos.filter(function(orcamento) { 
        //filter funciona como uma estrutura de repetição. Para cada instrutor, ele vai rodar a function e vai enviar para dentro o orcamento. tudo que a função retornar true, ela vai colocar dentro do novo array filteredOrcamentos. tudo que for falso ele retira de dentro do novo array.
        return orcamento.id != id  //se o id for diferente do que o que esta desmembrado, ele vai colocar dentro do novo array (true)
    })

    data.orcamentos = filteredOrcamentos //recebendo os dados atualizados do novo array
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2 ), function(err) {
        if (err) return res.send("Write file error!")
        return res.redirect("/orcamentos")
    })
}
