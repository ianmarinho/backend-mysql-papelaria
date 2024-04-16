// const mysql =require("mysql");

// var pool =mysql.createPool({
//     "user":"LAB3-22",
//     "password":"",
//     "database":"papelaria",
//     "host":"localhost",
//     "port":3306

// });

// exports.pool=pool;

const mysql = require("mysql");

var pool = mysql.createPool({
    user: "root",
    password: "", // Insira a senha correta aqui
    database: "papelaria",
    host: "localhost",
    port: 3306
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conexão bem-sucedida ao banco de dados');
        connection.release(); // Liberar a conexão
    }
});

exports.pool = pool;
