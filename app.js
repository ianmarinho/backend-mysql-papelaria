const express = require('express')
const app = express();

const usuario = [

    {
        id: 1,
        nome: "Bleno",
        email: "bleno@gmail.com",
        senha: "123",
    },

    {
        id: 2,
        nome: "Felipe",
        email: "felipe@gmail.com",
        senha: "123",
    },

    {
        id: 3,
        nome: "Nero",
        email: "nero@gmail.com",
        senha: "123",
    },

    {
        id: 4,
        nome: "Carlinhos",
        email: "carlinhos@gmail.com",
        senha: "123",
    }

]
app.get("/", (require, res, next) => {

    res.json(usuario)

})

app.get("/usuario", (require, res, next) => {

    let nomes = [];
    usuario.map((linha) => {

        nomes.push({

            nome: linha.nome,
            email: linha.email

        })

    })
    res.json(nomes)

})

app.post("/usuario", (require, res, next) => {
    const id = require.body.id;
    const nome = require.body.nome;
    const email = require.body.email;
    const senha = require.body.senha;
    const dados = [{
        id,
        nome,
        email,
        senha
    }]

    console.log ();

});


module.exports = app