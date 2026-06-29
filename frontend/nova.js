const API = 'http://localhost:3000/tarefas';

document
    .getElementById('formTarefa')
    .addEventListener('submit', async (e) => {

        e.preventDefault();

        const tarefa = {

            titulo:
                document.getElementById('titulo').value,

            descricao:
                document.getElementById('descricao').value,

            prioridade:
                document.getElementById('prioridade').value,

            prazo:
                document.getElementById('prazo').value
        };

        await fetch(API, {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(tarefa)
        });

        window.location.href = 'index.html';
    });