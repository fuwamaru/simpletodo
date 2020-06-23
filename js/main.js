window.onload = function () {
  const addlistButton = document.querySelector(".main-header__list-add-button");
  addlistButton.addEventListener("click", addList);

  init();
};

init = () => {
  document.querySelector(".main-content").innerHTML = "";

  const lists = JSON.parse(localStorage.getItem("lists"));

  if (lists) {
    lists.forEach((list) => {
      const listname = createNewListElement(list.name, list.id);
      bindListEvents(listname);
    });
  }

  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const list_Outside = document.querySelector(".main-content__section");

  if (tasks) {
    tasks.forEach((task) => {
      const listItem = createNewTaskElement(task.name);
      const listid = task.listid;
      const match_list = document.body.querySelector(
        `[data-list-id="${listid}"]`
      );

      const incompleteTasksHolder = match_list.querySelector(
        ".main-content__section--list-incomplete-tasks"
      );
      const completedTasksHolder = match_list.querySelector(
        ".main-content__section--list-completed-tasks"
      );

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
  }
};

function formatDate(date, format) {
  format = format.replace(/yyyy/g, date.getFullYear());
  format = format.replace(/MM/g, ("0" + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/dd/g, ("0" + date.getDate()).slice(-2));
  format = format.replace(/HH/g, ("0" + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ("0" + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ("0" + date.getSeconds()).slice(-2));
  format = format.replace(/SSS/g, ("00" + date.getMilliseconds()).slice(-3));
  return format;
}

function createList(listString, id) {
  const listInner = `
  <div class="main-content__section--list" data-list-id="${id}">
    <div class="main-content__section--list-header">
      <h2 class="main-content__section--list-title">${listString}</h2>
      <input type="text" class="main-content__section--list-title-text">
      <div class="main-content__section--list-button">
        <button class="list__edit">
          <img class="img__edit" src="img/list_edit.svg">
        </button>
        <button class="list__delete">
          <img class="img__delete" src="img/list_delete.svg">
        </button>
      </div>
    </div>
    <div class="main-content__section--list-task-add">
      <input
        class="main-content__section--list-task-add-input"
        type="text"
      />
      <button class="main-content__section--list-task-add-button">
        <img
          class="main-content__section--list-img-add"
          src="img/add.svg"
        />
      </button>
    </div>
    <ul class="main-content__section--list-incomplete-tasks"></ul>
    <ul class="main-content__section--list-completed-tasks"></ul>
  </div>
`;
  return listInner;
}

addList = (e) => {
  const clickedButton = e.target;
  const main_header = clickedButton.parentNode.parentNode;
  const listInput = main_header.querySelector(".main-header__list-add-input");
  const now = new Date();
  const formatedDate = formatDate(now, "yyyyMMddHHmmssSSS");
  const listItem = createNewListElement(listInput.value, formatedDate);
  const lists = JSON.parse(localStorage.getItem("lists"));

  bindListEvents(listItem);

  if (lists === null) {
    const thisList = [
      {
        id: formatedDate,
        name: listInput.value,
      },
    ];
    localStorage.setItem("lists", JSON.stringify(thisList));
  } else {
    const thisList = {
      id: formatedDate,
      name: listInput.value,
    };
    lists.push(thisList);
    localStorage.setItem("lists", JSON.stringify(lists));
  }
};

createNewListElement = (listString, id) => {
  const mainContent = document.querySelector(".main-content");
  const listInner = createList(listString, id);
  const list_Outside = document.createElement("section");
  list_Outside.className = "main-content__section";
  list_Outside.innerHTML = listInner;

  mainContent.appendChild(list_Outside);

  const add_task_button = list_Outside.querySelector(
    ".main-content__section--list-task-add-button"
  );
  add_task_button.addEventListener("click", addTask);

  return list_Outside;
};

addTask = (e) => {
  const clickedButton = e.target;
  const list_body = clickedButton.parentNode.parentNode.parentNode;
  const taskInput = list_body.querySelector(
    ".main-content__section--list-task-add-input"
  );
  const incompleteTasksHolder = list_body.querySelector(
    ".main-content__section--list-incomplete-tasks"
  );
  const listItem = createNewTaskElement(taskInput.value);
  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (tasks === null) {
    const thisTask = [
      { name: taskInput.value, status: 0, listid: list_body.dataset.listId },
    ];
    localStorage.setItem("tasks", JSON.stringify(thisTask));
  } else {
    const thisTask = {
      name: taskInput.value,
      status: 0,
      listid: list_body.dataset.listId,
    };
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

editList = function () {
  const listItem = this.parentNode.parentNode;
  const editInput = listItem.querySelector("input[type=text]");
  const label = listItem.querySelector("h2");
  const isEditMode = listItem.classList.contains("editMode");

  if (isEditMode) {
    label.innerText = editInput.value;
  } else {
    editInput.value = label.innerText;
  }
  listItem.classList.toggle("editMode");

  const lists = JSON.parse(localStorage.getItem("lists"));
  const list_id = this.parentNode.parentNode.parentNode.dataset.listId;

  const edited_lists = lists.map((list) => {
    if (list.id === list_id) {
      const object = {
        id: list_id,
        name: editInput.value,
      };
      return object;
    } else {
      return list;
    }
  });

  localStorage.setItem("lists", JSON.stringify(edited_lists));
};

function deleteList() {
  const list_id = this.parentNode.parentNode.parentNode.dataset.listId;

  const lists = JSON.parse(localStorage.getItem("lists"));

  const deleted_lists = lists.filter((list) => {
    return list.id != list_id;
  });

  const tasks = JSON.parse(localStorage.getItem("tasks"));

  if (tasks) {
    const deleted_tasks = tasks.filter((task) => {
      return task.listid != list_id;
    });
    if (!deleted_tasks) {
      localStorage.removeItem("tasks");
    }
    localStorage.setItem("tasks", JSON.stringify(deleted_tasks));
  }

  if (!deleted_lists) {
    localStorage.removeItem("lists");
  }

  localStorage.setItem("lists", JSON.stringify(deleted_lists));

  init();
}

editTask = function () {
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

  const labels__incomplete = document.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = document.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );
  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({
      name: label.innerText,
      status: 0,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({
      name: label.innerText,
      status: 1,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

deleteTask = function (e) {
  const listItem = this.parentNode;
  const ul = listItem.parentNode;
  ul.removeChild(listItem);

  const labels__incomplete = document.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = document.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );
  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({
      name: label.innerText,
      status: 0,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({
      name: label.innerText,
      status: 1,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

taskCompleted = function () {
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
  const labels__incomplete = document.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = document.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );

  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({
      name: label.innerText,
      status: 0,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({
      name: label.innerText,
      status: 1,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

taskIncomplete = function () {
  const listItem = this.parentNode;
  listItem.querySelector("label").className = "";
  const article = listItem.parentNode.parentNode;
  const incompleteTasksHolder = article.querySelector(
    ".main-content__section--list-incomplete-tasks"
  );
  incompleteTasksHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  const ul = this.parentNode.parentNode;
  const labels__incomplete = document.querySelectorAll(
    ".main-content__section--list-incomplete-tasks label"
  );
  const labels__completed = document.querySelectorAll(
    ".main-content__section--list-completed-tasks label"
  );

  const labelsArray__incomplete = [];
  Array.prototype.forEach.call(labels__incomplete, (label) => {
    labelsArray__incomplete.push({
      name: label.innerText,
      status: 0,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  const labelsArray__completed = [];
  Array.prototype.forEach.call(labels__completed, (label) => {
    labelsArray__completed.push({
      name: label.innerText,
      status: 1,
      listid: label.parentNode.parentNode.parentNode.dataset.listId,
    });
  });
  labelsArray__incomplete.push(...labelsArray__completed);
  localStorage.setItem("tasks", JSON.stringify(labelsArray__incomplete));
};

function bindTaskEvents(taskListItem, checkBoxEventHandler) {
  var checkBox = taskListItem.querySelector('input[type="checkbox"]');
  var editButton = taskListItem.querySelector("button.edit");
  var deleteButton = taskListItem.querySelector("button.delete");
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
}

function bindListEvents(list) {
  const ListeditButton = list.querySelector("button.list__edit");
  const ListdeleteButton = list.querySelector("button.list__delete");
  ListeditButton.onclick = editList;
  ListdeleteButton.onclick = deleteList;
}
