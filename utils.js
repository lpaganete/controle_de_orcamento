
module.exports = {

    age: function(timestamp) {
        const today = new Date() //objeto de data de hj
        const birthDate = new Date(timestamp) //data do aniversario
    
        // 2019 - 1984 = 35
        let age = today.getFullYear() - birthDate.getFullYear() //getFull year é um metodo que pega o ano todo
     
        // 11 - 12 = -1
        // 11 - 11 = 0
        const month = today.getMonth() - birthDate.getMonth()
        if ( month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }
    
        return age 
    },

    //transformando data que esta em ms no banco em data que o html entenda
    date: function(timestamp) {
        const date = new Date(timestamp)

        //yyyy
        const year =  date.getUTCFullYear()
        
        //mm
        const month = `0${date.getUTCMonth() + 1}`.slice(-2) //estemétodo está pegando somente os 2 últimos numeros 

        //dd
        const day = `0${date.getUTCDate()}`.slice(-2)
        
        //return yyy-mm-dd
        return  {
            day,
            month,
            year, 
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`
        }

    },


    somaGastos: function(somaGastos) {
        return somaGastos = parseFloat(university) + parseFloat(food) + parseFloat(telephone) + parseFloat(educabr) + parseFloat(creditcard) + parseFloat(any) + parseFloat(economy)
    }


}