// ==========================================
// TASKFLOW - FIREBASE JAVASCRIPT
// ==========================================

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

// Import Firestore
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


// ==========================================
// FIREBASE CONFIGURATION
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyDdIETf6wAO_7nLY2C3GeFAuxKFKtzaOzU",
    authDomain: "taskflow1-417b2.firebaseapp.com",
    projectId: "taskflow1-417b2",
    storageBucket: "taskflow1-417b2.firebasestorage.app",
    messagingSenderId: "845687929925",
    appId: "1:845687929925:web:54f40a5af755074ad3372c"
};


// Start Firebase
const app = initializeApp(firebaseConfig);

// Connect to Firestore
const db = getFirestore(app);


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCounter = document.getElementById("taskCounter");
const formMessage = document.getElementById("formMessage");
const errorMessage = document.getElementById("errorMessage");

const filterButtons = document.querySelectorAll(".filter-btn");


// ==========================================
// VARIABLES
// ==========================================

let tasks = [];
let currentFilter = "all";


// ==========================================
// LOAD TASKS WHEN PAGE OPENS
// ==========================================

loadTasks();


// ==========================================
// LOAD TASKS FROM FIRESTORE
// ==========================================

async function loadTasks() {

    try {

        errorMessage.textContent = "";

        const snapshot = await getDocs(
            collection(db, "tasks")
        );

        tasks = [];

        snapshot.forEach(function(documentSnapshot) {

            tasks.push({
                id: documentSnapshot.id,
                ...documentSnapshot.data()
            });

        });


        // Newest tasks first
        tasks.sort(function(a, b) {

            const timeA = a.createdAt
                ? a.createdAt.toMillis()
                : 0;

            const timeB = b.createdAt
                ? b.createdAt.toMillis()
                : 0;

            return timeB - timeA;

        });


        renderTasks();

    }

    catch (error) {

        console.error("Error loading tasks:", error);

        errorMessage.textContent =
            "Could not load tasks from Firebase.";

    }

}


// ==========================================
// ADD TASK
// ==========================================

taskForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    // Get task text
    const title = String(taskInput.value || "").trim();


    // Check empty task
    if (title === "") {

        formMessage.textContent =
            "Please enter a task.";

        return;

    }


    // Check maximum length
    if (title.length > 100) {

        formMessage.textContent =
            "Task must be 100 characters or less.";

        return;

    }


    formMessage.textContent = "";
    errorMessage.textContent = "";


    try {

        // Save task to Firestore
        await addDoc(
            collection(db, "tasks"),
            {
                title: title,
                completed: false,
                createdAt: serverTimestamp()
            }
        );


        // Clear input
        taskInput.value = "";


        // Reload tasks
        await loadTasks();

    }

    catch (error) {

        console.error("Error adding task:", error);

        errorMessage.textContent =
            "Could not add task.";

    }

});


// ==========================================
// DISPLAY TASKS
// ==========================================

function renderTasks() {

    taskList.innerHTML = "";


    let filteredTasks = tasks;


    // Active tasks
    if (currentFilter === "active") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === false;

        });

    }


    // Completed tasks
    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(function(task) {

            return task.completed === true;

        });

    }


    // Create each task
    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");

        li.classList.add("task");

        li.dataset.id = task.id;


        // Completed task
        if (task.completed === true) {

            li.classList.add("completed");

        }


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed === true;

        checkbox.setAttribute(
            "aria-label",
            "Complete task"
        );


        // Task title
        const taskTitle = document.createElement("span");

        taskTitle.classList.add("task-title");

        taskTitle.textContent = task.title || "";


        // Edit button
        const editButton = document.createElement("button");

        editButton.classList.add("edit-btn");

        editButton.type = "button";

        editButton.textContent = "Edit";


        // Delete button
        const deleteButton = document.createElement("button");

        deleteButton.classList.add("delete-btn");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";


        // Add elements
        li.appendChild(checkbox);

        li.appendChild(taskTitle);

        li.appendChild(editButton);

        li.appendChild(deleteButton);


        taskList.appendChild(li);

    });


    updateCounter();

}


// ==========================================
// COMPLETE / UNCOMPLETE TASK
// ==========================================

taskList.addEventListener("change", async function(event) {

    if (event.target.type !== "checkbox") {

        return;

    }


    const taskElement =
        event.target.closest(".task");


    if (!taskElement) {

        return;

    }


    const taskId =
        taskElement.dataset.id;


    const completed =
        event.target.checked;


    try {

        // Update Firestore
        await updateDoc(
            doc(db, "tasks", taskId),
            {
                completed: completed
            }
        );


        // Update local task
        const task = tasks.find(function(item) {

            return item.id === taskId;

        });


        if (task) {

            task.completed = completed;

        }


        renderTasks();

    }

    catch (error) {

        console.error("Error updating task:", error);

        errorMessage.textContent =
            "Could not update task.";

    }

});


// ==========================================
// EDIT AND DELETE TASKS
// ==========================================

taskList.addEventListener("click", async function(event) {

    const taskElement =
        event.target.closest(".task");


    if (!taskElement) {

        return;

    }


    const taskId =
        taskElement.dataset.id;


    const task = tasks.find(function(item) {

        return item.id === taskId;

    });


    if (!task) {

        return;

    }


    // ======================================
    // EDIT TASK
    // ======================================

    if (event.target.classList.contains("edit-btn")) {

        const newTitle = prompt(
            "Edit your task:",
            task.title || ""
        );


        if (newTitle === null) {

            return;

        }


        const cleanTitle =
            newTitle.trim();


        if (cleanTitle === "") {

            alert("Task cannot be empty.");

            return;

        }


        if (cleanTitle.length > 100) {

            alert(
                "Task must be 100 characters or less."
            );

            return;

        }


        try {

            await updateDoc(
                doc(db, "tasks", taskId),
                {
                    title: cleanTitle
                }
            );


            await loadTasks();

        }

        catch (error) {

            console.error("Error editing task:", error);

            errorMessage.textContent =
                "Could not edit task.";

        }

    }


    // ======================================
    // DELETE TASK
    // ======================================

    if (event.target.classList.contains("delete-btn")) {

        const confirmed = confirm(
            "Are you sure you want to delete this task?"
        );


        if (!confirmed) {

            return;

        }


        try {

            await deleteDoc(
                doc(db, "tasks", taskId)
            );


            await loadTasks();

        }

        catch (error) {

            console.error("Error deleting task:", error);

            errorMessage.textContent =
                "Could not delete task.";

        }

    }

});


// ==========================================
// FILTER BUTTONS
// ==========================================

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter =
            button.dataset.filter;


        filterButtons.forEach(function(btn) {

            btn.classList.remove("active");

        });


        button.classList.add("active");


        renderTasks();

    });

});


// ==========================================
// TASK COUNTER
// ==========================================

function updateCounter() {

    const remainingTasks =
        tasks.filter(function(task) {

            return task.completed !== true;

        }).length;


    if (remainingTasks === 1) {

        taskCounter.textContent =
            "1 task left";

    }

    else {

        taskCounter.textContent =
            remainingTasks + " tasks left";

    }

}