const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [];
let currentFilter = "all"; // tracks which filter is currently selected

function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        return;
    }

    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '❌';
    deleteBtn.classList.add('delete-btn');

    li.appendChild(span);
    li.appendChild(deleteBtn);

    li.addEventListener('click', function () {
        li.classList.toggle('completed');
        applyFilter(); // re-check visibility since completed status just changed
    });

    deleteBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        li.remove();
    });

    taskList.appendChild(li);

    taskInput.value = '';
    applyFilter(); // make sure the new task respects the currently active filter
}

// ===== Filter Logic =====
// Shows/hides existing <li> tasks based on which filter button is active.
// Defined OUTSIDE addTask() so it's accessible everywhere in this file.
function applyFilter() {
    // convert taskList's <li> children (HTMLCollection) into a real array so filter() works
    const allTasks = Array.from(taskList.children);

    // find only the tasks that should be HIDDEN for the current filter
    const tasksToHide = allTasks.filter((li) => {
        const isCompleted = li.classList.contains('completed');

        if (currentFilter === 'active') return isCompleted;     // "Active" -> hide completed ones
        if (currentFilter === 'completed') return !isCompleted; // "Completed" -> hide non-completed ones
        return false; // "All" -> hide nothing
    });

    allTasks.forEach((li) => (li.style.display = 'flex'));    // reset: show everything
    tasksToHide.forEach((li) => (li.style.display = 'none')); // hide only filtered-out ones
}

// runs applyFilter() whenever a filter button (All/Active/Completed) is clicked
filterButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
        currentFilter = btn.dataset.filter; // read which filter this button represents

        filterButtons.forEach((b) => b.classList.remove('active')); // clear old highlight
        btn.classList.add('active'); // highlight the clicked button

        applyFilter(); // refresh visibility for the new filter
    });
});

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});