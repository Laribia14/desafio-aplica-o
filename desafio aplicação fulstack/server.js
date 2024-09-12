const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Criar tabela de tarefas
db.serialize(() => {
  db.run("CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)");
});

// Adicionar tarefa
app.post('/tasks', (req, res) => {
  const { name } = req.body;
  db.run("INSERT INTO tasks (name) VALUES (?)", [name], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name });
  });
});

// Listar tarefas
app.get('/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Atualizar tarefa
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.run("UPDATE tasks SET name = ? WHERE id = ?", [name, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, name });
  });
});

// Excluir tarefa
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(204).end();
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
