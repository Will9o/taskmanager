const Firebird = require('node-firebird');
const options = require('../db');

exports.listar = (req, res) => {

    Firebird.attach(options, (err, db) => {

        if (err) {
            console.error('Erro ao conectar ao banco:', err);
            return res.status(500).json(err);
        }

        db.query('SELECT * FROM tarefas', (err, result) => {

            db.detach();

            if (err) {
                console.error('Erro ao listar tarefas:', err);
                return res.status(500).json(err);
            }

            res.json(result);
        });
    });
};

exports.criar = (req, res) => {

    const {
        titulo,
        descricao,
        prioridade,
        prazo
    } = req.body;

    console.log('Dados recebidos:', req.body);

    Firebird.attach(options, (err, db) => {

        if (err) {
            console.error('Erro ao conectar ao banco:', err);
            return res.status(500).json(err);
        }

        db.query(
            `
            INSERT INTO tarefas
            (
                titulo,
                descricao,
                prioridade,
                prazo,
                concluida
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                titulo,
                descricao,
                prioridade,
                prazo,
                'N'
            ],
            (err) => {

                db.detach();

                if (err) {
                    console.error('Erro ao inserir tarefa:', err);
                    return res.status(500).json(err);
                }

                console.log('Tarefa cadastrada com sucesso!');

                res.json({
                    sucesso: true,
                    mensagem: 'Tarefa criada com sucesso.'
                });
            }
        );
    });
};

exports.atualizar = (req, res) => {

    const { id } = req.params;

    const {
        titulo,
        descricao,
        prioridade,
        prazo,
        concluida
    } = req.body;

    Firebird.attach(options, (err, db) => {

        if (err) {
            console.error('Erro ao conectar ao banco:', err);
            return res.status(500).json(err);
        }

        db.query(
            `
            UPDATE tarefas
            SET
                titulo = ?,
                descricao = ?,
                prioridade = ?,
                prazo = ?,
                concluida = ?
            WHERE id = ?
            `,
            [
                titulo,
                descricao,
                prioridade,
                prazo,
                concluida,
                id
            ],
            (err) => {

                db.detach();

                if (err) {
                    console.error('Erro ao atualizar tarefa:', err);
                    return res.status(500).json(err);
                }

                res.json({
                    sucesso: true,
                    mensagem: 'Tarefa atualizada com sucesso.'
                });
            }
        );
    });
};

exports.remover = (req, res) => {

    const { id } = req.params;

    Firebird.attach(options, (err, db) => {

        if (err) {
            console.error('Erro ao conectar ao banco:', err);
            return res.status(500).json(err);
        }

        db.query(
            'DELETE FROM tarefas WHERE id = ?',
            [id],
            (err) => {

                db.detach();

                if (err) {
                    console.error('Erro ao remover tarefa:', err);
                    return res.status(500).json(err);
                }

                res.json({
                    sucesso: true,
                    mensagem: 'Tarefa removida com sucesso.'
                });
            }
        );
    });
};