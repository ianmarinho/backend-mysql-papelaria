const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool; // Supondo que "mysql" é o pool de conexão

router.get("/", (req, res, next) => {
    mysql.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        connection.query("SELECT * FROM produto", (error, rows) => {
            connection.release(); // Liberar a conexão após a consulta
            if (error) {
                return res.status(500).send({
                    error: error.message
                });
            }

            res.status(200).send({
                mensagem: "Aqui está a lista de produtos",
                produtos: rows
            });
        });
    });
});

router.get("/:id", (req, res, next) => {
    const id = req.params.id

    console.log(req.body);

    mysql.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        connection.query("SELECT * FROM produto where id =?", [id], (error, rows) => {
            connection.release(); // Liberar a conexão após a consulta
            if (error) {
                console.log("passando na linha 80")
                console.log(msg)
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de produtos",
                produto: rows
            });
        });
    });
});
router.get("/codbarras/:id", (req, res, next) => {
    const id = req.params.id

    console.log(req.body);

    mysql.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        connection.query("SELECT * FROM produto where codbarras =?", [id], (error, rows) => {
            connection.release(); // Liberar a conexão após a consulta
            if (error) {
                console.log("passando na linha 80")
                console.log(msg)
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de produtos",
                produto: rows
            });
        });
    });
});
router.get("/qrcode/:id", (req, res, next) => {
    const id = req.params.id

    console.log(req.body);

    mysql.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        connection.query("SELECT * FROM produto where qrcode =?", [id], (error, rows) => {
            connection.release(); // Liberar a conexão após a consulta
            if (error) {
                console.log("passando na linha 80")
                console.log(msg)
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de produtos",
                produto: rows
            });
        });
    });
});

router.post('/', (req, res, next) => {
    const { descricao, tipo, cor, codbarras, qrcode, foto, tamanho } = req.body;


    // Verifica se o produto já está cadastrado
    mysql.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({
                error: error.message,
                response: null
            });
        }

            // Insere o novo produto no banco de dados
            connection.query(`INSERT INTO produto (descricao, tipo, cor, codbarras, qrcode, foto, tamanho) VALUES (?, ?, ?, ?,?,?,?)`,
                [descricao, tipo, cor, codbarras, qrcode, foto, tamanho], (error, result) => {
                    connection.release();
                    if (error) {
                        return res.status(500).send({
                            error: error.message,
                            response: null
                        });
                    }

                    res.status(201).send({
                        mensagem: "Produto cadastrado com sucesso!",
                        produto: {
                            id: result.insertId,
                        }
                    });
                });
        });
    });


router.put("/", (req, res, next) => {
    const { id,descricao, tipo, cor, codbarras, qrcode, foto, tamanho } = req.body;

    mysql.getConnection((error, connection) => {
        if (error) {

            return res.status(500).send({
                error: error.message
            });
        }

        connection.query("UPDATE produto SET status = ?, descricao = ?, estoque_minimo = ?, estoque_maximo = ? WHERE id_ = ?",
       [ descricao, tipo, cor, codbarras, qrcode, foto, tamanho, id], (error, result) => {
                connection.release();
                if (error) {
                    return res.status(500).send({
                        error: error.message
                    });
                }
                res.status(200).send({
                    mensagem: "Cadastro alterado com sucesso"
                });
            });
    });
});
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;

    if (!id || id === "") {
        return res.status(400).send({
            mensagem: "ID do produto não fornecido."
        });
    }

    mysql.getConnection((error, connection) => {
        if (error) {
            console.log("Erro ao conectar no banco MySQL: " + error.message);
            return res.status(500).send({
                error: error.message
            });
        }
        
        connection.query("DELETE FROM produto WHERE id = ?", [id], (error, result) => {
            connection.release();
            if (error) {
                console.log("Erro ao deletar: " + error.message);
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Cadastro deletado com sucesso"
            });
        });
    });
});


module.exports = router;
