const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const formMessage = document.getElementById("formMessage");
const errorMessage = document.getElementById("errorMessage");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = [
    {
        id: 1,
        title: "Learn JavaScript",
        completed: false
    },
    {
        id: 2,
        title: "Finish TaskFlow project",
        completed: true
    }
];


// This keeps track of the selected filter
let currentFilter = "all";


// ========================================
// DISPLAY TASKS WHEN PAGE LOADS
// ========================================

renderTasks();


// ========================================
// ADD A TASK
// ========================================

taskForm.addEventListener("submit", function(event) {

    // Stop the page from refreshing
    event.preventDefault();


    // Get the text from the input
    const title = taskInput.value.trim();


    // Check if the input is empty
    if (title === "") {

        formMessage.textContent = "Please enter a task.";

        return;
    }


    // Remove previous error message
    formMessage.textContent = "";


    // Create a new task
    const newTask = {
        id: Date.now(),
        title: title,
        completed: false
    };


    // Add task to the array
    tasks.push(newTask);


    // Clear the input
    taskInput.value = "";


    // Display tasks again
    renderTasks();

});


// ========================================
// DISPLAY TASKS
// ========================================

function renderTasks() {

    // Clear the current list
    taskList.innerHTML = "";


    // Start with all tasks
    let filteredTasks = tasks;


    // ====================================
    // ACTIVE FILTER
    // ====================================

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === false;

        });

    }


    // ====================================
    // COMPLETED FILTER
    // ====================================

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === true;

        });

    }


    // ====================================
    // CREATE TASK ELEMENTS
    // ====================================

    filteredTasks.forEach(function(task) {

        // Create <li>
        const li = document.createElement("li");

        li.classList.add("task");


        // If task is completed
        if (task.completed === true) {

            li.classList.add("completed");

        }


        // Store task ID inside the <li>
        li.dataset.id = task.id;


        // ====================================
        // CHECKBOX
        // ====================================

        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            "Complete task"
        );


        // ====================================
        // TASK TITLE
        // ====================================

        const taskTitle = document.createElement("span");

        taskTitle.classList.add("task-title");

        taskTitle.textContent = task.title;


        // ====================================
        // EDIT BUTTON
        // ====================================

        const editButton = document.createElement("button");

        editButton.classList.add("edit-btn");

        editButton.textContent = "Edit";


        // ====================================
        // DELETE BUTTON
        // ====================================

        const deleteButton = document.createElement("button");

        deleteButton.classList.add("delete-btn");

        deleteButton.textContent = "Delete";


        // ====================================
        // ADD ELEMENTS TO <li>
        // ====================================

        li.appendChild(checkbox);

        li.appendChild(taskTitle);

        li.appendChild(editButton);

        li.appendChild(deleteButton);


        // Add <li> to the list
        taskList.appendChild(li);

    });


    // Update number of tasks
    updateCounter();

}


// ========================================
// COMPLETE / UNCOMPLETE TASK
// ========================================

taskList.addEventListener("change", function(event) {

    // Check if the changed element is a checkbox
    if (event.target.type !== "checkbox") {

        return;
    }


    // Find the task <li>
    const taskElement = event.target.closest(".task");


    // Get the task ID
    const taskId = Number(taskElement.dataset.id);


    // Find the task in the array
    const task = tasks.find(function(task) {

        return task.id === taskId;

    });


    // Change completed status
    task.completed = event.target.checked;


    // Display tasks again
    renderTasks();

});


// ========================================
// EDIT AND DELETE TASKS
// ========================================

taskList.addEventListener("click", function(event) {

    // Find the task <li>
    const taskElement = event.target.closest(".task");


    if (!taskElement) {

        return;
    }


    // Get task ID
    const taskId = Number(taskElement.dataset.id);


    // Find task
    const task = tasks.find(function(task) {

        return task.id === taskId;

    });


    // ====================================
    // EDIT TASK
    // ====================================

    if (event.target.classList.contains("edit-btn")) {

        const newTitle = prompt(
            "Edit your task:",
            task.title
        );


        // User pressed Cancel
        if (newTitle === null) {

            return;
        }


        // Remove extra spaces
        const cleanTitle = newTitle.trim();


        // Don't allow empty task
        if (cleanTitle === "") {

            alert("Task cannot be empty.");

            return;
        }


        // Update task title
        task.title = cleanTitle;


        // Display tasks again
        renderTasks();

    }


    // ====================================
    // DELETE TASK
    // ====================================

    if (event.target.classList.contains("delete-btn")) {

        const confirmed = confirm(
            "Are you sure you want to delete this task?"
        );


        if (!confirmed) {

            return;
        }


        // Remove task from array
        tasks = tasks.filter(function(task) {

            return task.id !== taskId;

        });


        // Display tasks again
        renderTasks();

    }

});


// ========================================
// FILTER BUTTONS
// ========================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        // Get filter name
        currentFilter = button.dataset.filter;


        // Remove active class from all buttons
        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        // Highlight selected button
        button.classList.add("active");


        // Display filtered tasks
        renderTasks();

    });

});


// ========================================
// TASK COUNTER
// ========================================

function updateCounter() {

    // Count tasks that are NOT completed
    const remainingTasks = tasks.filter(function(task) {

        return task.completed === false;

    }).length;


    // Display correct text
    if (remainingTasks === 1) {

        taskCounter.textContent = "1 task left";

    } else {

        taskCounter.textContent =
            remainingTasks + " tasks left";

    }

  }