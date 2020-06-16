window.onload = function () {
  const addButtons = document.querySelectorAll("button");

  Array.prototype.forEach.call(addButtons, (button) => {
    button.addEventListener("click", addTask);
  });
  init();
};

init = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  console.log(tasks);

  const article = document.querySelector(".main-content__section");
  const incompleteTasksHolder = article.querySelector(
    ".main-content__section--list-incomplete-tasks"
  );
  const completedTasksHolder = article.querySelector(
    ".main-content__section--list-completed-tasks"
  );

  tasks.forEach((task) => {
    const listItem = createNewTaskElement(task.name);

    if (task.status) {
      const checkBox = listItem.querySelector('input[type="checkbox"]');
      checkBox.checked = true;
      listItem.querySelector("label").className =
        "main-content__section--list-completed-task-label";
      completedTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskIncomplete);
    } else {
      listItem.querySelector("label").className = "";
      incompleteTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskCompleted);
    }
  });
};

addTask = (e) => {
  console.log("Add Task...");

  const clickedButton = e.target;
  const article = clickedButton.parentNode.parentNode.parentNode;
  const taskInput = article.querySelector(
    ".main-content__section--list-task-add-input"
  );
  const incompleteTasksHolder = article.querySelector(
    ".main-content__section--list-incomplete-tasks"
  );
  const listItem = createNewTaskElement(taskInput.value);

  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (tasks === null) {
    const thisTask = [{ name: taskInput.value, status: 0 }];
    localStorage.setItem("tasks", JSON.stringify(thisTask));
  } else {
    const thisTask = { name: taskInput.value, status: 0 };
    tasks.push(thisTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);
  taskInput.value = "";
};

createNewTaskElement = (taskString) => {
  const listItem = document.createElement("li");
  const checkBox = document.createElement("input");
  const label = document.createElement("label");
  const editInput = document.createElement("input");
  const editButton = document.createElement("button");
  const deleteButton = document.createElement("button");

  checkBox.type = "checkBox";
  editInput.type = "text";

  listItem.className = "list__task";
  editButton.className = "edit";
  const Edit = document.createElement("img");
  Edit.src = "img/edit.svg";
  editButton.appendChild(Edit);
  Edit.className = "img__edit";
  deleteButton.className = "delete";
  const Delete = document.createElement("img");
  Delete.src = "img/delete.svg";
  deleteButton.appendChild(Delete);
  Delete.className = "img__delete";

  label.innerText = taskString;

  listItem.appendChild(checkBox);
  listItem.appendChild(label);
  listItem.appendChild(editInput);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
};

editTask = function () {
  console.log("Edit Task...");

  const listItem = this.parentNode;

  const editInput = listItem.querySelector("input[type=text]");
  const label = listItem.querySelector("label");

  const isEditMode = listItem.classList.contains("editMode");

  if (isEditMode) {
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }
  listItem.classList.toggle("editMode");

  const ul = this.parentNode.parentNode;
  const section = ul.parentNode;
  const labels__incomplete = section.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = section.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );
  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({ name: label.innerText, status: 0 });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({ name: label.innerText, status: 1 });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

deleteTask = function (e) {
  console.log("Delete Task...");
  const listItem = this.parentNode;
  const ul = listItem.parentNode;
  ul.removeChild(listItem);

  const section = ul.parentNode;
  const labels__incomplete = section.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = section.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );
  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({ name: label.innerText, status: 0 });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({ name: label.innerText, status: 1 });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

taskCompleted = function () {
  console.log("Task Complete...");
  const listItem = this.parentNode;
  listItem.querySelector("label").className =
    "main-content__section--list-completed-task-label";
  const article = listItem.parentNode.parentNode;
  const completedTasksHolder = article.querySelector(
    ".main-content__section--list-completed-tasks"
  );
  completedTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskIncomplete);

  const ul = this.parentNode.parentNode;
  const section = ul.parentNode;
  const labels__incomplete = section.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = section.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );
  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({ name: label.innerText, status: 0 });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({ name: label.innerText, status: 1 });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

taskIncomplete = function () {
  console.log("Task Incomplete...");
  const listItem = this.parentNode;
  listItem.querySelector("label").className = "";
  const article = listItem.parentNode.parentNode;
  const incompleteTasksHolder = article.querySelector(
    ".main-content__section--list-incomplete-tasks"
  );
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  const ul = this.parentNode.parentNode;
  const section = ul.parentNode;
  const labels__incomplete = section.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = section.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );
  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({ name: label.innerText, status: 0 });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({ name: label.innerText, status: 1 });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

var bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  console.log("Bind List item events");
  var checkBox = taskListItem.querySelector('input[type="checkbox"]');
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};
