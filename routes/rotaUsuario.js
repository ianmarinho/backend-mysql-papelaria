const express = require("express")
const router = express.Router();

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
router.get("/", (require, res, next) => {

    res.json(usuario)

})

router.get("/usuario", (require, res, next) => {

    let nomes = [];
    usuario.map((linha) => {

        nomes.push({

            nome: linha.nome,
            email: linha.email

        })

    })
    res.json(nomes)

})

router.post("/usuario", (require, res, next) => {
    const id = require.body.id;

    res.send({ id: id })

});

router.put("/usuario", (require, res, next) => {
    const id = require.body.id;

    res.send({ id: id })

});

router.delete("/usuario/:id", (require, res, next) => {
    const id = require.params;

    res.send({ id: id })

});


module.exports = router