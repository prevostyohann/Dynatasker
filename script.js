document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');

    // Charger les tâches depuis le stockage local
   /*  loadTasks(); */

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask();
    });

    function addTask() {
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const date = document.getElementById('task-date').value;

        if (title === '' || date === '') {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        const task = {
            title,
            desc,
            date,
            completed: false
        };

        // Ajouter la tâche au stockage local
        saveTask(task);

        // Ajouter la tâche à l'interface utilisateur
        renderTask(task);

        taskForm.reset();
    }

    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /* function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => renderTask(task));
    } */

    function renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskElement.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.desc}</p>
                <small>${task.date}</small>
            </div>
            <div>
                <button class="complete-btn">Terminer</button>
                <button class="edit-btn">Modifier</button>
                <button class="delete-btn">Supprimer</button>
            </div>
        `;

        taskList.appendChild(taskElement);

        taskElement.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed;
            updateTask(task);
            taskElement.classList.toggle('completed');
        });

        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task);
            taskElement.remove();
        });

        taskElement.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(task, taskElement);
        });
    }

    function updateTask(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.title === updatedTask.title ? updatedTask : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function deleteTask(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.title !== taskToDelete.title);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function editTask(taskToEdit, taskElement) {
        document.getElementById('task-title').value = taskToEdit.title;
        document.getElementById('task-desc').value = taskToEdit.desc;
        document.getElementById('task-date').value = taskToEdit.date;

        deleteTask(taskToEdit);

        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            taskToEdit.title = document.getElementById('task-title').value;
            taskToEdit.desc = document.getElementById('task-desc').value;
            taskToEdit.date = document.getElementById('task-date').value;
            saveTask(taskToEdit);
            taskElement.remove(); // Supprimer l'ancienne tâche de l'interface utilisateur
            taskForm.reset();
        }, { once: true });
    }
});