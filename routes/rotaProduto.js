const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

// Remova a criação da tabela daqui e coloque-a em algum lugar que seja executado uma vez no início do servidor.

router.get("/", (req, res, next) => {
    db.all("SELECT * FROM produto", (error, rows) => {
        if (error) {
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

router.post('/', (req, res, next) => {
    const { status, descricao, estoque_minimo, estoque_maximo } = req.body;

    // Verifica se todas as variáveis estão definidas
    if (status === undefined || descricao === undefined || estoque_minimo === undefined || estoque_maximo === undefined) {
        return res.status(400).send({
            mensagem: "Falha ao cadastrar produto. Certifique-se de fornecer todos os campos necessários."
        });
    }

    // Validação dos campos
    let msg = [];
    if (!status || status.length < 3) {
        msg.push({ mensagem: "Status inválido! Deve ter pelo menos 3 caracteres." });
    }

    if (!descricao || descricao.trim() === "") {
        msg.push({ mensagem: "Coloque a procedência do produto." });
    }

    // Validação para verificar se estoque_minimo e estoque_maximo são números
    if (isNaN(estoque_minimo) || isNaN(estoque_maximo)) {
        msg.push({ mensagem: "Estoque mínimo e máximo devem ser números válidos." });
    } else {
        // Se desejar, você pode adicionar verificações específicas para os valores numéricos, como >= 0, etc.
    }

    if (msg.length > 0) {
        return res.status(400).send({
            mensagem: "Falha ao cadastrar produto.",
            erros: msg
        });
    }

    // Verifica se o produto já está cadastrado
    db.get(`SELECT * FROM produto WHERE status = ? AND descricao = ?`, [status, descricao], (error, produtoExistente) => {
        if (error) {
            return res.status(500).send({
                error: error.message,
                response: null
            });
        }

        if (produtoExistente) {
            return res.status(400).send({
                mensagem: "Produto já cadastrado."
            });
        }

        // Insere o novo produto no banco de dados
        db.run(`INSERT INTO produto (status, descricao, estoque_minimo, estoque_maximo) VALUES (?, ?, ?, ?)`,
            [status, descricao, estoque_minimo, estoque_maximo], function (insertError) {
                if (insertError) {
                    return res.status(500).send({
                        error: insertError.message,
                        response: null
                    });
                }
                res.status(201).send({
                    mensagem: "Produto cadastrado com sucesso!",
                    produto: {
                        id: this.lastID,
                        status,
                        descricao,
                        estoque_minimo,
                        estoque_maximo
                    }
                });
            });
    });
});

router.put("/", (req, res, next) => {
    const { id, status, descricao, estoque_minimo, estoque_maximo } = req.body;

    db.run(" UPDATE produto SET status = ?, descricao = ?, estoque_minimo = ?, estoque_maximo =? WHERE id = ?",
        [status, descricao, estoque_minimo, estoque_maximo, id], function (error) {

            if (error) {
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Cadastro alterado com sucesso",
            })

        })

});

router.delete("/:id", (req, res, next) => {
    const { id } = req.params;

    db.run("DELETE FROM produto WHERE id = ?", id, (error) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Cadastrado deletado com successo",

        })

    });

});
module.exports = router;
