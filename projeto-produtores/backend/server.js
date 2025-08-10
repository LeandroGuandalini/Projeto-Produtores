const express = require('express');
const path = require('path');
const produtoresRoutes = require('./routes/produtores');
require('./database') //para a criação das tabelas

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

app.use('/produtores', produtoresRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
