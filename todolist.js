// Global array to store the state of our To-Do list
let tasks = [];

// --- Task 2: Persistence (Load tasks from localStorage) ---
function loadTasks() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

function saveTasks() {
    // Save the current state of the tasks array to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// --- Task 1: Render Tasks (DOM Manipulation) ---
function renderTasks() {
    const list = document.getElementById('task-list');
    list.innerHTML = ''; // Clear the current list

    tasks.forEach(task => {
        // 1. Create List Item (li)
        const listItem = document.createElement('li');
        listItem.dataset.id = task.id; // Store ID for easy access
        
        // Apply 'completed' class if the task is done
        if (task.completed) {
            listItem.classList.add('completed');
        }

        // 2. Task Text Element
        const taskText = document.createElement('span');
        taskText.classList.add('task-text');
        taskText.textContent = task.text;
        taskText.addEventListener('click', () => toggleComplete(task.id)); // Toggle on click

        // 3. Action Buttons Container
        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        // 4. Edit Button
        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '✏️ Edit';
        editBtn.addEventListener('click', () => editTask(task.id, taskText));

        // 5. Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '❌ Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        // 6. Assemble the list item
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        listItem.appendChild(taskText);
        listItem.appendChild(actionsDiv);
        list.appendChild(listItem);
    });
}

// --- Task 1: Add Feature ---
function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const newTask = {
        id: Date.now(), // Use a timestamp as a unique ID
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    input.value = ''; // Clear input field
    input.focus();
}

// --- Task 1: Toggle Complete Feature ---
function toggleComplete(id) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks();
        renderTasks();
    }
}

// --- Task 1: Delete Feature ---
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// --- Task 1: Edit Feature (Basic Inline Editing) ---
function editTask(id, taskTextElement) {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return;

    // 1. Replace the <span> with an <input type="text">
    const currentText = tasks[taskIndex].text;
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;
    inputField.maxLength = 50; // Limit input length
    
    // Replace the text element with the input field
    taskTextElement.parentNode.replaceChild(inputField, taskTextElement);
    inputField.focus();

    // 2. Save changes when 'Enter' is pressed or focus is lost
    const saveEdit = () => {
        const newText = inputField.value.trim();
        if (newText !== '' && newText !== currentText) {
            tasks[taskIndex].text = newText;
            saveTasks();
        }
        // Replace the input field back with the updated <span> element
        renderTasks(); 
    };

    inputField.addEventListener('blur', saveEdit); // Save on focus lost
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}


// --- Event Listeners and Initialization ---

// 1. Initial Load and Render
loadTasks();
renderTasks();

// 2. Event Listener for 'Add Task' button
document.getElementById('add-button').addEventListener('click', addTask);

// 3. Task 3: Keyboard Accessibility (Allow 'Enter' key to add a task)
document.getElementById('task-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});