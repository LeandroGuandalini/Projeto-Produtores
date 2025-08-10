const express = require('express');
const router = express.Router();
const db = require('../database');

//com esse get vamos puxar o cadastro
router.get('/cadastro', (req, res) => {
    res.sendFile('cadastro_produtor.html', { root: './public' });
});


//aqui vamos enviar o forms de cadastro para o bd
router.post('/cadastro', (req, res) => {
    const { nome, localidade, telefone } = req.body;

    //verificando se preencheu todas as colunas
    if (!nome || !localidade || !telefone) {
        return res.send('Preencha todos os campos!');
    }

    //inserir de fato no bd, caso nao houver problemas
    db.run(
        `INSERT INTO produtores (nome, localidade, telefone) VALUES (?, ?, ?)`,
        [nome, localidade, telefone],
        function (err) {
            if (err) {
                console.error(err);
                return res.send('Erro ao cadastrar produtor.');
            }
            res.send(`
                <h1>Produtor cadastrado com sucesso!</h1>
                <a href="/">Voltar</a>
            `);
        }
    );
});

module.exports = router;
