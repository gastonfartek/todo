let tasks;
const parser = new DOMParser();

const saveState = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const withSideEffect =
  (fn) =>
  (...params) => {
    fn(...params);
    saveState();
    render();
  };

const createTask = withSideEffect((e) => {
  e.preventDefault();

  if (typeof Storage === "undefined") {
    console.log(
      "This browser does not support Local Storage, try a different browser!"
    );
    return;
  }

  const taskDescription = document.getElementById("task-description").value;
  const taskID = Math.floor(Math.random() * 100000);

  const task = {
    id: taskID,
    description: taskDescription,
    completed: false,
  };

  tasks.push(task);
  document.getElementById("task-description").value = "";
});

const toggleTask = (task) =>
  withSideEffect((e) => {
    const index = tasks.findIndex((t) => t.id === task.id);
    tasks[index].completed = !tasks[index].completed;
  });

const deleteTask = (task) =>
  withSideEffect(() => {
    tasks = tasks.filter((t) => t.id !== task.id);
  });

const renderTask = (cb) => (task) => {
  const input = document.createElement("input");
  input.onchange = toggleTask(task);
  input.type = "checkbox";
  input.checked = task.completed;

  const list = parser.parseFromString(
    `
    <div class="list">
      <p>${task.description}</p>
    </div>
  `,
    "text/html"
  ).body.firstChild;

  list.prepend(input);

  if (task.completed) {
    const deleteButton = document.createElement("button");
    deleteButton.onclick = deleteTask(task);
    deleteButton.style =
      "background: transparent; border: none; display: flex; cursor: pointer";
    deleteButton.innerHTML = `<img style="width:15x" src="delete-button.png">`;
    list.appendChild(deleteButton);
  }

  cb(document.createElement("div").appendChild(list));
};

function render() {
  const taskList = document.getElementById("tasks-list");
  taskList.innerHTML = "";
  tasks.forEach(renderTask(taskList.appendChild.bind(taskList)));
}

tasks = JSON.parse(localStorage.getItem("tasks") ?? "[]");

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#task-form").addEventListener("submit", createTask);
  render();
});
