const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;// Supondo que "mysql" é o pool de conexão
const bcrypt = require('bcrypt'); // Para hash de senha
const jwt = require('jsonwebtoken'); // Para geração de token JWT

// Rota para listar todos os usuários
router.get("/", (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        
        conn.query("SELECT * FROM usuario", (error, rows) => {
            conn.release(); // Liberar a conexão após o uso
            if (error) {
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de usuários",
                usuarios: rows
            });
        });
    });
});

// Rota para obter um usuário específico por ID
router.get("/:id", (req, res, next) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        
        conn.query("SELECT * FROM usuario WHERE id = ?", [id], (error, rows) => {
            conn.release(); // Liberar a conexão após o uso
            if (error) {
                return res.status(500).send({
                    error: error.message
                });
            }
            res.status(200).send({
                mensagem: "Aqui está o usuário com ID " + id,
                usuario: rows[0] // Se houver, retornar o primeiro usuário encontrado
            });
        });
    });
});

// Rota para fazer login
router.post('/login', (req, res, next) => {
    const { email, senha } = req.body;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        
        conn.query("SELECT * FROM usuario WHERE email = ?", [email], (error, rows) => {
            conn.release(); // Liberar a conexão após o uso
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
            
            const usuario = rows[0];
            bcrypt.compare(senha, usuario.senha, (bcryptError, result) => {
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
                // Gerar token JWT
                const token = jwt.sign({ id: usuario.id, email: usuario.email }, 'secreto', { expiresIn: '1h' });
                res.status(200).send({
                    mensagem: "Login bem sucedido.",
                    token: token
                });
            });
        });
    });
});


// Rota para cadastrar um novo usuário
router.post('/', (req, res, next) => {
    const { nome, email, senha } = req.body;

    console.log(req.body);

    // Verificação e validação dos campos omitida por brevidade
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
            conn.query(`INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)`, [nome, email, hashedPassword], (insertError, result) => {
                conn.release(); // Liberar a conexão após o uso
                if (insertError) {
                    return res.status(500).send({
                        error: insertError.message
                    });
                }
                res.status(201).send({
                    mensagem: "Cadastro criado com sucesso!",
                    usuario: {
                        id: result.insertId,
                        nome: nome,
                        email: email
                    }
                });
            });
        });
    });
});

// Rota para atualizar um usuário existente
router.put("/", (req, res, next) => {
    const { id, nome, email, senha } = req.body;
    // Validação dos campos omitida por brevidade
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        
        conn.query("UPDATE usuario SET nome = ?, email = ?, senha = ? WHERE id = ?", [nome, email, senha, id], (updateError, result) => {
            conn.release(); // Liberar a conexão após o uso
            if (updateError) {
                return res.status(500).send({
                    error: updateError.message
                });
            }
            res.status(200).send({
                mensagem: "Cadastro alterado com sucesso"
            });
        });
    });
});

// Rota para deletar um usuário existente
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        
        conn.query("DELETE FROM usuario WHERE id = ?", [id], (deleteError, result) => {
            conn.release(); // Liberar a conexão após o uso
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
