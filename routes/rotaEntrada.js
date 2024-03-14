const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.run("CREATE TABLE IF NOT EXISTS entrada (id INTEGER PRIMARY KEY AUTOINCREMENT, id_produto, quantidade REAL, valor_unitario REAL, data DATE)", (createTableError) => {
    if (createTableError) {
        return res.status(500).send({
            error: createTableError.message
        });
    }

    // O restante do código, se necessário...


});

router.get("/", (req, res, next) => {
    db.all("SELECT * FROM entrada INNER JOIN produto ON entrada.id_produto = produto.id", (error, rows) => {

        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({
            mensagem: "Aqui está a lista de entrada",
            entrada: rows
        });
    });
});

// Rota para registrar uma entrada de produtos no estoque
router.post('/', (req, res) => {
    const { idproduto, quantidade, valorunitario, dataentrada } = req.body;

    // Inserir os dados da entrada na nova tabela
    db.run(`INSERT INTO entrada (id_produto, quantidade, valor_unitario, data) VALUES (?, ?, ?, ?)`,
        [idproduto, quantidade, valorunitario, dataentrada],
        function (insertError) {
            if (insertError) {
                return res.status(500).send({
                    error: insertError.message,
                    response: null
                });
            }

            res.status(201).send({
                mensagem: "Entrada Registrada!",
                entradaProduto: {
                    id: this.lastID,
                    idproduto: idproduto,
                    quantidade: quantidade,
                    valorunitario: valorunitario,
                    dataentrada: dataentrada
                }
            });
        });
});

router.delete("/:id", (req, res, next) => {
    const { id } = req.params;

    db.run("DELETE FROM entrada WHERE id = ?", id, (error) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Cadastro deletado com successo",

        })

    });

});

module.exports = router;
