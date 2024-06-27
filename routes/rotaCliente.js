const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Listar todos os clientes
router.get("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        conn.query("SELECT * FROM Clientes", (error, rows) => {
            conn.release();
            if (error) {
                console.log(error.message);
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de clientes",
                clientes: rows
            });
        });
    });
});

// Buscar cliente por ID
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        conn.query("SELECT * FROM Clientes WHERE id = ?", [id], (error, rows) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error.message
                });
            }
            if (rows.length < 1) {
                return res.status(404).send({
                    mensagem: "Cliente não encontrado"
                });
            }
            res.status(200).send({
                mensagem: "Aqui está o cliente com ID " + id,
                cliente: rows[0]
            });
        });
    });
});

// Login de cliente
router.post('/login', (req, res, next) => {
    const { email, senha } = req.body;

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        conn.query("SELECT * FROM Clientes WHERE Email = ?", [email], (error, rows) => {
            conn.release();
            if (error) {
                return res.status(500).send({
                    error: error.message
                });
            }

            if (rows.length < 1) {
                return res.status(401).send({
                    mensagem: "Usuário não encontrado."
                });
            }

            const cliente = rows[0];

            bcrypt.compare(senha, cliente.Senha, (bcryptError, result) => {
                if (bcryptError) {
                    return res.status(500).send({
                        error: bcryptError.message
                    });
                }
                if (!result) {
                    return res.status(401).send({
                        mensagem: "Senha incorreta."
                    });
                }

                // Geração do token JWT
                const token = jwt.sign({ id: cliente.ID }, chaveSecreta, { expiresIn: '1h' });

                res.status(200).send({
                    mensagem: "Login bem sucedido.",
                    token: token
                });
            });
        });
    });
});

// Cadastro de novo cliente
router.post('/', (req, res, next) => {
    const { nome, email, telefone, senha, cep, logradouro, complemento, bairro, localidade, uf, cpf, dataNascimento, genero } = req.body;

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        bcrypt.hash(senha, 8, (hashError, hashedPassword) => {
            if (hashError) {
                return res.status(500).send({
                    error: hashError.message
                });
            }

            conn.query(
                `INSERT INTO Clientes (Nome, Email, Telefone, Senha, cep, logradouro, complemento, bairro, localidade, uf, CPF, DataNascimento, Genero) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nome, email, telefone, hashedPassword, cep, logradouro, complemento, bairro, localidade, uf, cpf, dataNascimento, genero],
                (insertError, result) => {
                    conn.release();
                    if (insertError) {
                        return res.status(500).send({
                            error: insertError.message
                        });
                    }
                    res.status(201).send({
                        mensagem: "Cadastro criado com sucesso!",
                        cliente: {
                            id: result.insertId,
                            nome: nome,
                            email: email
                        }
                    });
                }
            );
        });
    });
});

// Atualizar cliente
router.put("/", (req, res, next) => {
    const { id, nome, email, telefone, senha, cep, logradouro, complemento, bairro, localidade, uf, cpf, dataNascimento, genero } = req.body;

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        bcrypt.hash(senha, 8, (hashError, hashedPassword) => {
            if (hashError) {
                return res.status(500).send({
                    error: hashError.message
                });
            }

            conn.query(
                `UPDATE Clientes SET Nome = ?, Email = ?, Telefone = ?, Senha = ?, cep = ?, logradouro = ?, complemento = ?, bairro = ?, localidade = ?, uf = ?, CPF = ?, DataNascimento = ?, Genero = ? WHERE id = ?`,
                [nome, email, telefone, hashedPassword, cep, logradouro, complemento, bairro, localidade, uf, cpf, dataNascimento, genero, id],
                (updateError, result) => {
                    conn.release();
                    if (updateError) {
                        return res.status(500).send({
                            error: updateError.message
                        });
                    }
                    res.status(200).send({
                        mensagem: "Cadastro alterado com sucesso"
                    });
                }
            );
        });
    });
});

// Excluir cliente
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        conn.query("DELETE FROM Clientes WHERE id = ?", [id], (deleteError, result) => {
            conn.release();
            if (deleteError) {
                return res.status(500).send({
                    error: deleteError.message
                });
            }
            res.status(200).send({
                mensagem: "Cadastro deletado com sucesso"
            });
        });
    });
});

module.exports = router;
