const express = require('express');
const cors = require('cors');

const tarefaRoutes = require('./routes/tarefas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/tarefas', tarefaRoutes);

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});