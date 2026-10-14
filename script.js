
const taskForm = document.getElementById("taskForm");
const taskTitle = document.getElementById("taskTitle");
const subject = document.getElementById("subject");
const dueDate = document.getElementById("dueDate");
const taskList = document.getElementById("taskList");
const filterTasks = document.getElementById("filterTasks");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];

try {
    tasks = JSON.parse(localStorage.getItem("studentTasks")) || [];
    if (!Array.isArray(tasks)) tasks = [];
} catch {
    tasks = [];
}

function saveTasks() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function displayTasks() {
    taskList.replaceChildren();

    const filter = filterTasks.value;

    const filteredTasks = tasks.filter(task => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true;
    });

    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";

    filteredTasks.forEach(task => {
        const card = document.createElement("div");
        card.className = "task-card";

        if (task.completed) {
            card.classList.add("completed");
        }

        const title = document.createElement("h3");
        title.textContent = task.title;

        const subjectText = document.createElement("p");
        subjectText.textContent = "Subject: " + task.subject;

        const dateText = document.createElement("p");
        dateText.textContent = "Due date: " + task.dueDate;

        const statusText = document.createElement("p");
        statusText.textContent =
            task.completed ? "Status: Completed" : "Status: Pending";

        if (!task.completed && task.dueDate < getToday()) {
            statusText.textContent = "Status: Overdue";
        }

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const completeButton = document.createElement("button");
        completeButton.className = "complete-button";
        completeButton.textContent =
            task.completed ? "Mark Pending" : "Mark Completed";

        completeButton.addEventListener("click", () => {
            task.completed = !task.completed;
            saveTasks();
            displayTasks();
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter(item => item.id !== task.id);
            saveTasks();
            displayTasks();
        });

        actions.append(completeButton, deleteButton);
        card.append(title, subjectText, dateText, statusText, actions);
        taskList.appendChild(card);
    });

    document.getElementById("totalTasks").textContent = tasks.length;

    document.getElementById("pendingTasks").textContent =
        tasks.filter(task => !task.completed).length;

    document.getElementById("completedTasks").textContent =
        tasks.filter(task => task.completed).length;
}

function getToday() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

dueDate.min = getToday();

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskTitle.value.trim();

    if (!title) {
        alert("Please enter a task name.");
        return;
    }

    if (dueDate.value < getToday()) {
        alert("Please select today or a future date.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        subject: subject.value,
        dueDate: dueDate.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    displayTasks();

    taskForm.reset();
    dueDate.min = getToday();
});

filterTasks.addEventListener("change", displayTasks);

displayTasks();
