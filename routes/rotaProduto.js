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

        connection.query("SELECT * FROM Produtos", (error, rows) => {
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

// Adicione uma nova rota para buscar produtos favoritos
router.get("/favoritos", (req, res, next) => {
    mysql.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({
                error: "Erro ao conectar ao banco de dados",
                mensagem: error.message
            });
        }

        connection.query("SELECT * FROM produto WHERE favorito = 1", (error, rows) => {
            connection.release();
            if (error) {
                return res.status(500).send({
                    error: "Erro ao executar consulta",
                    mensagem: error.message
                });
            }
            res.status(200).send({
                mensagem: "Lista de produtos favoritos recuperada com sucesso",
                produtos: rows
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
                console.log(produtos)
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

router.post('/favoritar/:id', (req, res, next) => {
    const { id } = req.params;

    mysql.getConnection((error, connection) => {
        if (error) {
            return res.status(500).send({
                error: error.message,
                response: null
            });
        }

        connection.query(`UPDATE produto SET favorito = NOT favorito WHERE id = ?`, [id], (error, result) => {
            connection.release();
            if (error) {
                return res.status(500).send({
                    error: error.message,
                    response: null
                });
            }

            res.status(200).send({
                mensagem: "Produto favoritado/desfavoritado com sucesso!"
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
