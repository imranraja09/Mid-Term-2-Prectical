  const taskInput = document.getElementById('taskInput');
        const addBtn = document.getElementById('addBtn');
        const taskList = document.getElementById('taskList');
        const taskCount = document.getElementById('taskCount');
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        const countAll = document.getElementById('countAll');
        const countPending = document.getElementById('countPending');
        const countCompleted = document.getElementById('countCompleted');
        const taskFooter = document.getElementById('taskFooter');
        const completedSummary = document.getElementById('completedSummary');
        const clearCompletedBtn = document.getElementById('clearCompletedBtn');

        // Initial LocalStorage state or rich sample data
        let tasks = JSON.parse(localStorage.getItem('elite_todo_tasks')) || [
            { text: "Explore the newly enhanced UI design 🚀", completed: false },
            { text: "Test switching between filter tabs 🎯", completed: true }
        ];

        let currentFilter = 'all';

        function saveTasks() {
            localStorage.setItem('elite_todo_tasks', JSON.stringify(tasks));
        }

        function renderTasks() {
            taskList.innerHTML = '';

            const totalCount = tasks.length;
            const pendingCount = tasks.filter(t => !t.completed).length;
            const completedCount = tasks.filter(t => t.completed).length;

            // Update badge counters
            countAll.textContent = totalCount;
            countPending.textContent = pendingCount;
            countCompleted.textContent = completedCount;
            taskCount.textContent = `${pendingCount} pending`;

            // Show or hide footer controls
            if (completedCount > 0) {
                taskFooter.style.display = 'flex';
                completedSummary.textContent = `${completedCount} completed task${completedCount > 1 ? 's' : ''}`;
            } else {
                taskFooter.style.display = 'none';
            }

            // Filter tasks based on active selection
            let filteredTasks = tasks.filter(task => {
                if (currentFilter === 'pending') return !task.completed;
                if (currentFilter === 'completed') return task.completed;
                return true;
            });

            if (filteredTasks.length === 0) {
                let message = "Your task list is completely empty! 🌟";
                if (currentFilter === 'pending') message = "Awesome! All pending tasks are cleared 🎉";
                if (currentFilter === 'completed') message = "No completed tasks yet. Time to hustle! 💪";
                
                taskList.innerHTML = `<li class="empty-state">${message}</li>`;
                return;
            }

            filteredTasks.forEach((task) => {
                const originalIndex = tasks.indexOf(task);

                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                
                li.innerHTML = `
                    <label class="task-content">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-status-tag">${task.completed ? 'Completed' : 'Pending'}</span>
                        <span class="task-text"></span>
                    </label>
                    <button class="delete-btn" title="Delete Task">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                `;

                // Safe text insertion
                li.querySelector('.task-text').textContent = task.text;

                // Checkbox toggle handler
                li.querySelector('.task-checkbox').addEventListener('change', () => {
                    tasks[originalIndex].completed = !tasks[originalIndex].completed;
                    saveTasks();
                    renderTasks();
                });

                // Delete single task handler
                li.querySelector('.delete-btn').addEventListener('click', () => {
                    tasks.splice(originalIndex, 1);
                    saveTasks();
                    renderTasks();
                });

                taskList.appendChild(li);
            });
        }

        // Add task logic (ignores empty inputs)
        function addTask() {
            const text = taskInput.value.trim();
            if (text === '') return;

            tasks.push({
                text: text,
                completed: false
            });

            taskInput.value = '';
            saveTasks();
            renderTasks();
            taskInput.focus();
        }

        // Filter tab switching
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.getAttribute('data-filter');
                renderTasks();
            });
        });

        // Clear completed tasks handler
        clearCompletedBtn.addEventListener('click', () => {
            tasks = tasks.filter(t => !t.completed);
            saveTasks();
            renderTasks();
        });

        // Event Listeners for adding tasks
        addBtn.addEventListener('click', addTask);
        
        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                addTask();
            }
        });

        // Initialize application on load
        renderTasks();