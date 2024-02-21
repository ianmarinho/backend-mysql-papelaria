const express = require('express')
const app = express();

app.use((require, res, next) => {

    res.json ({
        mensagem: "Olá Mundo!"
    })

})

module.exports = app