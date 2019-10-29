const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/*
 * Criar middleware para checar se ID do projeto existe. 
 * Se não existir, retornar um erro.
 */

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

/*
 * Criar middleware global que imprime (console.log) número de requisições.
 */

function logRequests(req, res, next) {

  console.count("Número de requisições");

  return next();
}

server.use(logRequests);


/*
 * Listar todos projetos e suas tarefas;
 */

server.get('/projects', (req, res) => {
  return res.json(projects);
});

/*
 * Cadastrar novo projeto no seguinte formato: 
 * { id: "1", title: 'Novo projeto', tasks: [] }; 
 */

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id, 
    title, 
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

/* 
 * Alterar título do projeto com o id presente nos parâmetros da rota; 
 */

server.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

/*
 * Deletar o projeto com o id presente nos parâmetros da rota;
 */

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

/*
 * Armazenar uma nova tarefa no projeto escolhido via id;
 */

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(4000);
