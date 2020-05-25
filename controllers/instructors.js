
const fs = require('fs') //importando a funcionalidade  fs
const data = require("../data.json") //pegando o arquivo data.json 
const { age, date } = require('../utils') //importando o objeto age que trata as datas

exports.index = function(req, res) {
    return res.render("instructors/index", { instructors: data.instructors })
}

exports.create = function(req, res) {
    return res.render("instructors/create")
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
    let{ avatar_url, birth, name, services, gender} = req.body //usei a variavel let pois ela pode mudar


    //=== TRATAMENTO DOS DADOS ===//
    birth = Date.parse(req.body.birth) //Mudando o formato da hr para milisegundos e trazendo para o data.json
    const created_at = Date.now() //trazendo a data da hr de criação do cadastro do instrutorpois (não existe no front)
    const id = Number(data.instructors.length + 1) //criando id para cada objeto. (não existe no front)


    //=== ENVIANDO DADOS PARA DENTRO DO DATA ===//
    //A cada vez que eu salvar ele irá armazenar os objetos dentro do data.json dentro de um array de objetos
    data.instructors.push({//usando o objeto JSON como um objeto JS
        
        id,
        avatar_url,
        name,
        birth,
        gender, 
        services,
        created_at,
        
    }) 

    //Depois de verificar se os campos estão preenchidos ele irá salvar os dados em um arquivo json
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function (err) { //Formatando arquivo data.json
        if (err) return res.send("Write file error!")

        return res.redirect("/instructors") //Depois de tudo salvo dentro do data.json, ele retorna para página instructors
    }) 
    
}

// *** SHOW ****/
exports.show = function (req, res) { 
    //req.query.id seria com o ?=...
    //req.body
    //req.params utilizando agr

    const {id} = req.params //retirando o id e fazendo com que ele seja uma variável

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    }) 

    if (!foundInstructor) { //se nao tiver o id que foi solicitado 
        return res.send("Instructor not found!")
    }

           

    //=== Tratando dados para mandar para o front ===//
    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        //split transforma a string em array
        services: foundInstructor.services.split(","),  
        created_at: new Intl.DateTimeFormat("pt-br").format(foundInstructor.created_at), //formatando a data para formato do Brasil
    }

    return res.render("instructors/show", {instructor: instructor})
    


}

 
//*** EDIT (Página para editar) ****/
exports.edit = function(req,res) {

    //reaproveitando estre trecho do show
    const {id} = req.params 

    const foundInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id
    }) 

    if (!foundInstructor) { //se nao tiver o id que foi solicitado 
        return res.send("Instructor not found!")
    }

    //
    // instructor.birth = 814665600000
    // date(instructor.birth)
    // return yyy-mm-dd

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth).iso 
    }
     
    return res.render("instructors/edit", {instructor})
}

//*** PUT (salvar oq foi editado no back-end) ****/
exports.put = function(req, res) {
    //reaproveitando estre trecho do edit
    const {id} = req.body
    let index = 0

    //verificando se o instrutor foi cadastrado
    const foundInstructor = data.instructors.find(function(instructor, foundIndex ) {
        if (id == instructor.id){ //adicionando um index ao objeto
            index = foundIndex
            return true
        }
    }) 
    //se o instrutor não foi cadastrado, ele retorn uma mensagems
    if (!foundInstructor)   return res.send("Instructor not found!")
    
    //espalhando dentro do objeto todos os dados que estão no data e todos os dados que estão no req.body (front-end)
    const instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    //agora meus  dados estão ok para serem colocados dentro do objjeto de data.js

    data.instructors[index] = instructor //adicionando no data somente o instructor que eu alterei

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`) //quando salvar o arquivo ele redireciona para a pagina do instrutor que foi alterado
    })
}

//*** DELETE ****/
exports.delete = function(req, res) {
    const {id} = req.body //pegando o id de dentro do body
    
    const filteredInstructors  = data.instructors.filter(function(instructor) { 
        //filter funciona como uma estrutura de repetição. Para cada instrutor, ele vai rodar a function e vai enviar para dentro o instructor. tudo que a função retornar true, ela vai colocar dentro do novo array filteredInstructors. tudo que for falso ele retira de dentro do novo array.
        return instructor.id != id  //se o id for diferente do que o que esta desmembrado, ele vai colocar dentro do novo array (true)
    })

    data.instructors = filteredInstructors //recebendo os dados atualizados do novo array
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2 ), function(err) {
        if (err) return res.send("Write file error!")
        return res.redirect("/instructors")
    })
}
