document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments du DOM nécessaires
    const taskForm = document.getElementById('task-form');
    const taskList = document.getElementById('task-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterActiveBtn = document.getElementById('filter-active');
    const filterCompletedBtn = document.getElementById('filter-completed');

    // Charger les tâches depuis le stockage local au chargement de la page
    loadTasks();

    // Ajouter un écouteur d'événement pour le formulaire de tâche
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Empêcher le comportement par défaut du formulaire
        addTask(); // Appeler la fonction pour ajouter une nouvelle tâche
    });

    // Ajouter des écouteurs d'événements pour les boutons de filtre
    filterAllBtn.addEventListener('click', () => filterTasks('all'));
    filterActiveBtn.addEventListener('click', () => filterTasks('active'));
    filterCompletedBtn.addEventListener('click', () => filterTasks('completed'));

    // Fonction pour ajouter une nouvelle tâche
    function addTask() {
        // Récupérer les valeurs des champs de formulaire
        const title = document.getElementById('task-title').value;
        const desc = document.getElementById('task-desc').value;
        const date = document.getElementById('task-date').value;

        // Vérifier que les champs obligatoires sont remplis
        if (title === '' || date === '') {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        // Créer un objet tâche
        const task = {
            title,
            desc,
            date,
            completed: false
        };

        // Sauvegarder la tâche dans le stockage local
        saveTask(task);

        // Recharger et trier les tâches
        loadTasks();

        // Réinitialiser le formulaire
        taskForm.reset();
    }

    // Fonction pour sauvegarder une tâche dans le stockage local
    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task); // Ajouter la nouvelle tâche au tableau
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Sauvegarder le tableau mis à jour
    }

    // Fonction pour charger les tâches depuis le stockage local
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date)); // Trier les tâches par date
        taskList.innerHTML = ''; // Vider la liste des tâches
        tasks.forEach(task => renderTask(task)); // Afficher chaque tâche
    }

    // Fonction pour afficher une tâche dans la liste
    function renderTask(task) {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        if (task.completed) {
            taskElement.classList.add('completed'); // Ajouter une classe si la tâche est complétée
        }
        taskElement.innerHTML = `
           <div class="columns py-5">
                <div class="column is-two-fifths">Titre de la Tâche <br> ${task.title}</div>
                <div class="column is-two-fifths">Description de la Tâche <br> ${task.desc}</div>
                <div class="column is-two-fifths mx-4">Date Echéance <br> ${task.date}</div>
                <div class="box column has-text-centered is-two-fifths py-1 mx-2"><br>
                    <button class="complete-btn">Terminer</button>
                    <button class="edit-btn">Modifier</button>
                    <button class="delete-btn">Supprimer</button>
                </div>
            </div>
        `;

        taskList.appendChild(taskElement); // Ajouter l'élément de tâche à la liste

        // Ajouter des écouteurs d'événements pour les boutons de la tâche
        taskElement.querySelector('.complete-btn').addEventListener('click', () => {
            task.completed = !task.completed; // Inverser l'état de complétion de la tâche
            updateTask(task); // Mettre à jour la tâche dans le stockage local
            taskElement.classList.toggle('completed'); // Mettre à jour l'affichage de la tâche
        });

        taskElement.querySelector('.delete-btn').addEventListener('click', () => {
            deleteTask(task); // Supprimer la tâche du stockage local
            taskElement.remove(); // Supprimer l'élément de tâche de l'affichage
        });

        taskElement.querySelector('.edit-btn').addEventListener('click', () => {
            editTask(task, taskElement); // Modifier la tâche
        });
    }

    // Fonction pour mettre à jour une tâche dans le stockage local
    function updateTask(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.title === updatedTask.title ? updatedTask : task); // Mettre à jour la tâche correspondante
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Sauvegarder les tâches mises à jour
    }

    // Fonction pour supprimer une tâche du stockage local
    function deleteTask(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.title !== taskToDelete.title); // Filtrer la tâche à supprimer
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Sauvegarder les tâches mises à jour
    }

    // Fonction pour modifier une tâche
    function editTask(taskToEdit, taskElement) {
        // Remplir le formulaire avec les valeurs de la tâche à modifier
        document.getElementById('task-title').value = taskToEdit.title;
        document.getElementById('task-desc').value = taskToEdit.desc;
        document.getElementById('task-date').value = taskToEdit.date;

        deleteTask(taskToEdit); // Supprimer la tâche originale

        // Ajouter un écouteur d'événement pour soumettre les modifications
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            taskToEdit.title = document.getElementById('task-title').value;
            taskToEdit.desc = document.getElementById('task-desc').value;
            taskToEdit.date = document.getElementById('task-date').value;
            saveTask(taskToEdit); // Sauvegarder la tâche modifiée
            taskElement.remove(); // Supprimer l'ancienne tâche de l'affichage
            taskForm.reset(); // Réinitialiser le formulaire
        }, { once: true }); // S'assurer que l'écouteur est appelé une seule fois
    }

    // Fonction pour filtrer les tâches en fonction de leur état
    function filterTasks(filter) {
        const tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
            switch (filter) {
                case 'all':
                    task.style.display = 'flex'; // Afficher toutes les tâches
                    break;
                case 'active':
                    task.style.display = task.classList.contains('completed') ? 'none' : 'flex'; // Afficher uniquement les tâches actives
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none'; // Afficher uniquement les tâches complétées
                    break;
            }
        });
    }
});
