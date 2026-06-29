const API = 'http://localhost:3000/tarefas';

const lista = document.getElementById('lista');

let tarefasGlobais = [];
let filtroAtual = 'todas';

async function carregarTarefas() {

    try {

        const resposta = await fetch(API);

        if (!resposta.ok) {
            throw new Error('Erro ao carregar tarefas');
        }

        const dados = await resposta.json();

        console.log('Tarefas recebidas:', dados);

        tarefasGlobais = Array.isArray(dados) ? dados : [];

        atualizarDashboard();
        renderizar();

    } catch (erro) {

        console.error(erro);
        lista.innerHTML = `
            <li>Erro ao carregar tarefas.</li>
        `;
    }
}

function atualizarDashboard() {

    document.getElementById('total').innerText =
        tarefasGlobais.length;

    document.getElementById('concluidas').innerText =
        tarefasGlobais.filter(t => t.concluida === 'S').length;

    document.getElementById('pendentes').innerText =
        tarefasGlobais.filter(t => t.concluida !== 'S').length;
}

function renderizar() {

    lista.innerHTML = '';

    let tarefas = [...tarefasGlobais];

    const pesquisa = document
        .getElementById('pesquisa')
        .value
        .toLowerCase();

    tarefas = tarefas.filter(t =>
        (t.titulo || '').toLowerCase().includes(pesquisa)
    );

    if (filtroAtual === 'pendentes') {
        tarefas = tarefas.filter(t => t.concluida !== 'S');
    }

    if (filtroAtual === 'concluidas') {
        tarefas = tarefas.filter(t => t.concluida === 'S');
    }

    if (tarefas.length === 0) {

        lista.innerHTML = '<li>Nenhuma tarefa encontrada.</li>';
        return;

    }

    tarefas.forEach(tarefa => {

        const li = document.createElement('li');

        li.className = 'tarefa';

        if (tarefa.concluida === 'S') {
            li.classList.add('concluida');
        }

        let prioridade = tarefa.prioridade || 'Baixa';
        let classePrioridade = 'baixa';

        if (prioridade === 'Média') {
            classePrioridade = 'media';
        }

        if (prioridade === 'Alta') {
            classePrioridade = 'alta';
        }

        // Formata a data para dd/mm/aaaa
        let prazo = '-';

        if (tarefa.prazo) {
            prazo = tarefa.prazo
                .substring(0, 10)
                .split('-')
                .reverse()
                .join('/');
        }

        li.innerHTML = `
            <div class="topo">

                <h3>${tarefa.titulo}</h3>

                <span class="prioridade ${classePrioridade}">
                    ${prioridade}
                </span>

            </div>

            <div class="descricao">
                ${tarefa.descricao || ''}
            </div>

            <div class="info">
                <span>
                    Prazo: ${prazo}
                </span>
            </div>

            <div class="acoes">

                <button
                    class="btn-concluir"
                    onclick="concluir(${tarefa.id})">
                    ✓
                </button>

                <button
                    class="btn-editar"
                    onclick="editar(${tarefa.id})">
                    ✎
                </button>

                <button
                    class="btn-excluir"
                    onclick="remover(${tarefa.id})">
                    X
                </button>

            </div>
        `;

        lista.appendChild(li);

    });

}

document
    .getElementById('pesquisa')
    .addEventListener('input', renderizar);

async function remover(id) {

    await fetch(`${API}/${id}`, {
        method: 'DELETE'
    });

    carregarTarefas();
}

async function concluir(id) {

    const tarefa =
        tarefasGlobais.find(t => t.id === id);

    if (!tarefa) return;

    await fetch(`${API}/${id}`, {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            ...tarefa,
            concluida: tarefa.concluida === 'S' ? 'N' : 'S'
        })

    });

    carregarTarefas();
}

async function editar(id) {

    const tarefa =
        tarefasGlobais.find(t => t.id === id);

    if (!tarefa) return;

    const novoTitulo =
        prompt('Novo título:', tarefa.titulo);

    if (!novoTitulo) return;

    await fetch(`${API}/${id}`, {

        method: 'PUT',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify({
            ...tarefa,
            titulo: novoTitulo
        })

    });

    carregarTarefas();
}

function filtrar(tipo) {

    filtroAtual = tipo;

    renderizar();
}

carregarTarefas();