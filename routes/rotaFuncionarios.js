const express = require("express");
const router = express.Router();
const mysql = require("../mysql").pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware para autenticação JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (token) {
        jwt.verify(token, 'secreto', (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

// Rota para listar todos os funcionários
router.get("/", authenticateJWT, (req, res) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        conn.query("SELECT * FROM Funcionarios", (error, rows) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send({
                mensagem: "Aqui está a lista de funcionários",
                funcionarios: rows
            });
        });
    });
});


// Rota para obter um funcionário específico por ID
router.get("/:id", authenticateJWT, (req, res) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        conn.query("SELECT * FROM Funcionario WHERE ID = ?", [id], (error, rows) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error.message });
            }
            if (rows.length === 0) {
                return res.status(404).send({ mensagem: "Funcionário não encontrado." });
            }
            res.status(200).send({
                mensagem: "Aqui está o funcionário com ID " + id,
                funcionario: rows[0]
            });
        });
    });
});

// Rota para criar um novo funcionário
router.post("/", authenticateJWT, (req, res) => {
    const { Nome, Email, Senha, CPF, DataNascimento, Sexo, Cargo, Departamento, DataContratacao, Salario, Telefone, Endereco, Cidade, Estado, CEP } = req.body;

    // Verificar se todos os campos obrigatórios estão preenchidos
    if (!Nome || !Email || !Senha || !CPF || !DataNascimento || !Sexo || !Cargo || !Departamento || !DataContratacao || !Salario || !Telefone || !Endereco || !Cidade || !Estado || !CEP) {
        return res.status(400).send({ mensagem: "Preencha todos os campos obrigatórios." });
    }

    // Hash da senha antes de armazenar
    bcrypt.hash(Senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }

        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }

            const sql = 'INSERT INTO Funcionario (Nome, Email, Senha, CPF, DataNascimento, Sexo, Cargo, Departamento, DataContratacao, Salario, Telefone, Endereco, Cidade, Estado, CEP, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [Nome, Email, hash, CPF, DataNascimento, Sexo, Cargo, Departamento, DataContratacao, Salario, Telefone, Endereco, Cidade, Estado, CEP, 'ativo'];

            conn.query(sql, values, (error, result) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error.message });
                }
                res.status(201).send({ mensagem: 'Funcionário criado com sucesso!' });
            });
        });
    });
});

// Rota para atualizar um funcionário
router.put('/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    const { Nome, Email, Senha, CPF, DataNascimento, Sexo, Cargo, Departamento, DataContratacao, Salario, Telefone, Endereco, Cidade, Estado, CEP } = req.body;

    // Hash da senha antes de atualizar
    bcrypt.hash(Senha, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }

        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({ error: error.message });
            }

            const sql = 'UPDATE Funcionario SET Nome = ?, Email = ?, Senha = ?, CPF = ?, DataNascimento = ?, Sexo = ?, Cargo = ?, Departamento = ?, DataContratacao = ?, Salario = ?, Telefone = ?, Endereco = ?, Cidade = ?, Estado = ?, CEP = ? WHERE ID = ?';
            const values = [Nome, Email, hash, CPF, DataNascimento, Sexo, Cargo, Departamento, DataContratacao, Salario, Telefone, Endereco, Cidade, Estado, CEP, id];

            conn.query(sql, values, (error, result) => {
                conn.release();
                if (error) {
                    return res.status(500).send({ error: error.message });
                }
                res.status(200).send({ mensagem: 'Funcionário atualizado com sucesso!' });
            });
        });
    });
});

// Rota para deletar um funcionário
router.delete('/:id', authenticateJWT, (req, res) => {
    const { id } = req.params;
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }

        const sql = 'DELETE FROM Funcionario WHERE ID = ?';
        conn.query(sql, [id], (error, result) => {
            conn.release();
            if (error) {
                return res.status(500).send({ error: error.message });
            }
            res.status(200).send({ mensagem: 'Funcionário deletado com sucesso!' });
        });
    });
});


module.exports = router;
