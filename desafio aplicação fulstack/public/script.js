document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
  
    // Função para listar tarefas
    const loadTasks = () => {
      fetch('/tasks')
        .then(response => response.json())
        .then(tasks => {
          taskList.innerHTML = '';
          tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = task.name;
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Excluir';
            deleteButton.onclick = () => deleteTask(task.id);
            li.appendChild(deleteButton);
            taskList.appendChild(li);
          });
        });
    };
  
    // Função para adicionar tarefa
    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const taskName = document.getElementById('task-name').value;
      fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: taskName })
      })
        .then(response => response.json())
        .then(() => {
          document.getElementById('task-name').value = '';
          loadTasks();
        });
    });
  
    // Função para excluir tarefa
    const deleteTask = (id) => {
      fetch(`/tasks/${id}`, {
        method: 'DELETE'
      })
        .then(() => loadTasks());
    };
  
    // Carregar tarefas ao iniciar
    loadTasks();
  });
  