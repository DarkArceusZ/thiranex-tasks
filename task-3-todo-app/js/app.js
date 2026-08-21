"use strict";

const STORAGE_KEY = "thiranex-task-3-tasks";
const MAX_TASK_LENGTH = 160;
const VALID_FILTERS = new Set(["all", "active", "completed"]);

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const formMessage = document.querySelector("#task-form-message");
const taskCount = document.querySelector("#task-count");
const filterControls = document.querySelector("#filter-controls");
const clearCompletedButton = document.querySelector("#clear-completed");
const taskList = document.querySelector("#task-list");
const emptyState = document.querySelector("#empty-state");
const emptyStateTitle = document.querySelector("#empty-state-title");
const emptyStateCopy = document.querySelector("#empty-state-copy");
const taskListStatus = document.querySelector("#task-list-status");

const restoredState = loadSavedTasks();
let tasks = restoredState.tasks;
let activeFilter = "all";
let editingTaskId = null;

initializeApp();

function initializeApp() {
  taskForm.addEventListener("submit", handleAddTask);
  taskInput.addEventListener("input", clearAddTaskError);
  filterControls.addEventListener("click", handleFilterChange);
  clearCompletedButton.addEventListener("click", clearCompletedTasks);

  // One set of delegated listeners handles all current and future task controls.
  taskList.addEventListener("change", handleTaskToggle);
  taskList.addEventListener("click", handleTaskAction);
  taskList.addEventListener("submit", handleEditSubmit);
  taskList.addEventListener("keydown", handleEditKeyboardShortcut);

  render();

  if (restoredState.notice) {
    setFormMessage(restoredState.notice, "warning");
    announce(restoredState.notice);
  }
}

function handleAddTask(event) {
  event.preventDefault();

  const result = validateTaskTitle(taskInput.value);

  if (!result.isValid) {
    taskInput.setAttribute("aria-invalid", "true");
    setFormMessage(result.message, "error");
    taskInput.focus();
    return;
  }

  const newTask = {
    id: createUniqueId(new Set(tasks.map((task) => task.id))),
    title: result.value,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks = [newTask, ...tasks];
  const wasSaved = saveTasks();
  taskForm.reset();
  taskInput.setAttribute("aria-invalid", "false");
  render();
  setFormMessage(
    wasSaved ? `Added "${newTask.title}".` : "Task added for this session, but browser storage is unavailable.",
    wasSaved ? "success" : "warning"
  );
  announce(wasSaved ? `Added task: ${newTask.title}.` : "Task added, but it may not persist after refresh.");
  taskInput.focus();
}

function clearAddTaskError() {
  if (taskInput.getAttribute("aria-invalid") === "true") {
    taskInput.setAttribute("aria-invalid", "false");
    setFormMessage("", "success");
  }
}

function handleFilterChange(event) {
  const filterButton = event.target.closest("button[data-filter]");

  if (!filterButton || !filterControls.contains(filterButton)) {
    return;
  }

  const nextFilter = filterButton.dataset.filter;

  if (!VALID_FILTERS.has(nextFilter) || nextFilter === activeFilter) {
    return;
  }

  activeFilter = nextFilter;
  editingTaskId = null;
  render();
  announce(`Showing ${getFilterLabel(activeFilter).toLowerCase()} tasks.`);
}

function handleTaskToggle(event) {
  const checkbox = event.target;

  if (!checkbox.matches("input[data-action='toggle']")) {
    return;
  }

  const taskId = getTaskIdFromElement(checkbox);
  const task = findTask(taskId);

  if (!task) {
    return;
  }

  const completed = checkbox.checked;
  tasks = tasks.map((item) => (item.id === taskId ? { ...item, completed } : item));
  const wasSaved = saveTasks();
  render();
  focusTaskControl(taskId, "toggle");

  const action = completed ? "Completed" : "Marked active";
  announce(
    wasSaved
      ? `${action}: ${task.title}.`
      : `${action}: ${task.title}. Changes may not persist after refresh.`
  );
}

function handleTaskAction(event) {
  const actionButton = event.target.closest("button[data-action]");

  if (!actionButton || !taskList.contains(actionButton)) {
    return;
  }

  const action = actionButton.dataset.action;
  const taskId = getTaskIdFromElement(actionButton);

  if (!taskId || !["edit", "delete", "cancel-edit"].includes(action)) {
    return;
  }

  if (action === "edit") {
    beginEditing(taskId);
    return;
  }

  if (action === "cancel-edit") {
    editingTaskId = null;
    render();
    focusTaskControl(taskId, "edit");
    announce("Edit cancelled.");
    return;
  }

  deleteTask(taskId);
}

function handleEditSubmit(event) {
  const editForm = event.target;

  if (!editForm.matches("form[data-edit-form]")) {
    return;
  }

  event.preventDefault();

  const taskId = getTaskIdFromElement(editForm);
  const task = findTask(taskId);
  const editInput = editForm.querySelector("input[data-edit-title]");

  if (!task || !editInput) {
    return;
  }

  const result = validateTaskTitle(editInput.value);

  if (!result.isValid) {
    showEditError(editForm, editInput, result.message);
    return;
  }

  tasks = tasks.map((item) => (item.id === taskId ? { ...item, title: result.value } : item));
  const wasSaved = saveTasks();
  editingTaskId = null;
  render();
  focusTaskControl(taskId, "edit");
  announce(
    wasSaved
      ? `Updated task: ${result.value}.`
      : `Updated task: ${result.value}. Changes may not persist after refresh.`
  );
}

function handleEditKeyboardShortcut(event) {
  if (event.key !== "Escape" || !event.target.matches("input[data-edit-title]")) {
    return;
  }

  const taskId = getTaskIdFromElement(event.target);
  editingTaskId = null;
  render();
  focusTaskControl(taskId, "edit");
  announce("Edit cancelled.");
}

function beginEditing(taskId) {
  if (!findTask(taskId)) {
    return;
  }

  editingTaskId = taskId;
  render();

  window.requestAnimationFrame(() => {
    const editInput = [...taskList.querySelectorAll("input[data-edit-title]")].find(
      (input) => getTaskIdFromElement(input) === taskId
    );

    if (editInput) {
      editInput.focus();
      editInput.select();
    }
  });
}

function deleteTask(taskId) {
  const task = findTask(taskId);

  if (!task) {
    return;
  }

  tasks = tasks.filter((item) => item.id !== taskId);
  const wasSaved = saveTasks();
  editingTaskId = null;
  render();
  focusActiveFilterButton();
  announce(
    wasSaved
      ? `Deleted task: ${task.title}.`
      : `Deleted task: ${task.title}. Changes may not persist after refresh.`
  );
}

function clearCompletedTasks() {
  const completedCount = tasks.filter((task) => task.completed).length;

  if (completedCount === 0) {
    return;
  }

  tasks = tasks.filter((task) => !task.completed);
  editingTaskId = null;
  const wasSaved = saveTasks();
  render();
  focusActiveFilterButton();
  announce(
    wasSaved
      ? `Cleared ${completedCount} completed ${completedCount === 1 ? "task" : "tasks"}.`
      : `Cleared completed tasks. Changes may not persist after refresh.`
  );
}

function render() {
  const visibleTasks = getVisibleTasks();
  taskList.replaceChildren();

  visibleTasks.forEach((task, index) => {
    taskList.append(createTaskElement(task, index));
  });

  taskList.hidden = visibleTasks.length === 0;
  renderEmptyState(visibleTasks.length);
  updateTaskSummary();
  updateFilterControls();
  clearCompletedButton.disabled = !tasks.some((task) => task.completed);
}

function createTaskElement(task, index) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " is-completed" : ""}`;
  item.dataset.taskId = task.id;

  if (task.id === editingTaskId) {
    item.append(createEditForm(task, index));
    return item;
  }

  const checkbox = document.createElement("input");
  const checkboxId = `task-toggle-${index}`;
  checkbox.className = "task-checkbox";
  checkbox.type = "checkbox";
  checkbox.id = checkboxId;
  checkbox.checked = task.completed;
  checkbox.dataset.action = "toggle";
  checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.completed ? "active" : "complete"}`);

  const details = document.createElement("div");
  details.className = "task-details";

  const title = document.createElement("label");
  title.className = "task-title";
  title.htmlFor = checkboxId;
  title.textContent = task.title;

  const meta = document.createElement("p");
  meta.className = "task-meta";

  const createdAt = document.createElement("time");
  createdAt.dateTime = task.createdAt;
  createdAt.textContent = `Created ${formatDate(task.createdAt)}`;
  meta.append(createdAt);

  if (task.completed) {
    const completedBadge = document.createElement("span");
    completedBadge.className = "completion-badge";
    completedBadge.textContent = "Completed";
    meta.append(completedBadge);
  }

  details.append(title, meta);

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.setAttribute("role", "group");
  actions.setAttribute("aria-label", `Actions for ${task.title}`);
  actions.append(
    createTaskButton("Edit", "edit", task.title),
    createTaskButton("Delete", "delete", task.title, "task-action-delete")
  );

  item.append(checkbox, details, actions);
  return item;
}

function createEditForm(task, index) {
  const form = document.createElement("form");
  form.className = "edit-form";
  form.dataset.editForm = "true";
  form.noValidate = true;

  const inputGroup = document.createElement("div");
  inputGroup.className = "input-group";

  const inputId = `edit-task-${index}`;
  const errorId = `edit-error-${index}`;
  const label = document.createElement("label");
  label.htmlFor = inputId;
  label.textContent = "Edit task";

  const input = document.createElement("input");
  input.id = inputId;
  input.name = "edit-title";
  input.type = "text";
  input.value = task.title;
  input.maxLength = MAX_TASK_LENGTH;
  input.required = true;
  input.dataset.editTitle = "true";
  input.setAttribute("aria-describedby", errorId);

  inputGroup.append(label, input);

  const saveButton = createTaskButton("Save", "save-edit", task.title);
  saveButton.type = "submit";
  saveButton.removeAttribute("data-action");
  saveButton.classList.add("button-primary");

  const cancelButton = createTaskButton("Cancel", "cancel-edit", task.title);

  const error = document.createElement("p");
  error.className = "edit-error";
  error.id = errorId;
  error.hidden = true;
  error.setAttribute("role", "alert");

  form.append(inputGroup, saveButton, cancelButton, error);
  return form;
}

function createTaskButton(label, action, taskTitle, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `task-action${extraClass ? ` ${extraClass}` : ""}`;
  button.dataset.action = action;
  button.textContent = label;
  button.setAttribute("aria-label", `${label} task: ${taskTitle}`);
  return button;
}

function showEditError(form, input, message) {
  const error = form.querySelector(".edit-error");
  input.setAttribute("aria-invalid", "true");
  error.textContent = message;
  error.hidden = false;
  input.focus();
}

function getVisibleTasks() {
  if (activeFilter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (activeFilter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function updateTaskSummary() {
  const total = tasks.length;
  const remaining = tasks.filter((task) => !task.completed).length;
  const taskLabel = total === 1 ? "task" : "tasks";
  taskCount.textContent = `${total} ${taskLabel} - ${remaining} remaining`;
}

function updateFilterControls() {
  filterControls.querySelectorAll("button[data-filter]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  });
}

function renderEmptyState(visibleTaskCount) {
  const shouldShow = visibleTaskCount === 0;
  emptyState.hidden = !shouldShow;

  if (!shouldShow) {
    return;
  }

  if (tasks.length === 0) {
    emptyStateTitle.textContent = "Your list is clear";
    emptyStateCopy.textContent = "Add a task above to get started.";
    return;
  }

  emptyStateTitle.textContent = `No ${getFilterLabel(activeFilter).toLowerCase()} tasks`;
  emptyStateCopy.textContent = "Try another filter or add a new task.";
}

function validateTaskTitle(value) {
  const normalizedValue = String(value).replace(/\s+/g, " ").trim();

  if (!normalizedValue) {
    return { isValid: false, message: "Enter a task before saving it." };
  }

  if (normalizedValue.length > MAX_TASK_LENGTH) {
    return {
      isValid: false,
      message: `Keep each task to ${MAX_TASK_LENGTH} characters or fewer.`
    };
  }

  return { isValid: true, value: normalizedValue };
}

function findTask(taskId) {
  return tasks.find((task) => task.id === taskId);
}

function getTaskIdFromElement(element) {
  return element.closest("[data-task-id]")?.dataset.taskId ?? null;
}

function getFilterLabel(filter) {
  return filter.charAt(0).toUpperCase() + filter.slice(1);
}

function focusTaskControl(taskId, action) {
  window.requestAnimationFrame(() => {
    const control = [...taskList.querySelectorAll(`[data-action="${action}"]`)].find(
      (element) => getTaskIdFromElement(element) === taskId
    );
    if (control) {
      control.focus();
      return;
    }

    // A task can disappear when it changes the active filter; retain a useful keyboard target.
    filterControls.querySelector(`button[data-filter="${activeFilter}"]`)?.focus();
  });
}

function focusActiveFilterButton() {
  window.requestAnimationFrame(() => {
    filterControls.querySelector(`button[data-filter="${activeFilter}"]`)?.focus();
  });
}

function formatDate(isoDate) {
  const date = new Date(isoDate);

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function createUniqueId(existingIds) {
  let id;

  do {
    id = window.crypto?.randomUUID?.() ?? `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  } while (existingIds.has(id));

  return id;
}

function loadSavedTasks() {
  let savedValue;

  try {
    savedValue = window.localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return {
      tasks: [],
      notice: "Browser storage is unavailable. Tasks will only remain until you refresh this page."
    };
  }

  if (savedValue === null) {
    return { tasks: [], notice: "" };
  }

  let parsedTasks;

  try {
    parsedTasks = JSON.parse(savedValue);
  } catch (error) {
    removeSavedTasks();
    return {
      tasks: [],
      notice: "Saved task data could not be read and has been safely reset."
    };
  }

  if (!Array.isArray(parsedTasks)) {
    removeSavedTasks();
    return {
      tasks: [],
      notice: "Saved task data was invalid and has been safely reset."
    };
  }

  const ids = new Set();
  let didRepairData = false;
  const normalizedTasks = [];

  parsedTasks.forEach((storedTask) => {
    const normalizedTask = normalizeStoredTask(storedTask, ids);

    if (!normalizedTask) {
      didRepairData = true;
      return;
    }

    if (normalizedTask.wasRepaired) {
      didRepairData = true;
    }

    normalizedTasks.push(normalizedTask.task);
  });

  const repairWasSaved = !didRepairData || writeTasksToStorage(normalizedTasks);

  return {
    tasks: normalizedTasks,
    notice: didRepairData
      ? repairWasSaved
        ? "Some saved task data was invalid and has been safely repaired."
        : "Saved task data was repaired for this session, but browser storage is unavailable."
      : ""
  };
}

function normalizeStoredTask(storedTask, knownIds) {
  if (!storedTask || typeof storedTask !== "object" || Array.isArray(storedTask)) {
    return null;
  }

  if (typeof storedTask.title !== "string") {
    return null;
  }

  const titleResult = validateTaskTitle(storedTask.title);

  if (!titleResult.isValid) {
    return null;
  }

  let wasRepaired = false;
  let id = typeof storedTask.id === "string" ? storedTask.id.trim() : "";

  if (!id || knownIds.has(id)) {
    id = createUniqueId(knownIds);
    wasRepaired = true;
  }

  knownIds.add(id);

  let createdAt = typeof storedTask.createdAt === "string" ? storedTask.createdAt : "";

  if (Number.isNaN(Date.parse(createdAt))) {
    createdAt = new Date().toISOString();
    wasRepaired = true;
  }

  if (storedTask.title !== titleResult.value || typeof storedTask.completed !== "boolean") {
    wasRepaired = true;
  }

  return {
    task: {
      id,
      title: titleResult.value,
      completed: storedTask.completed === true,
      createdAt
    },
    wasRepaired
  };
}

function saveTasks() {
  return writeTasksToStorage(tasks);
}

function writeTasksToStorage(tasksToSave) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksToSave));
    return true;
  } catch (error) {
    return false;
  }
}

function removeSavedTasks() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    return false;
  }
}

function setFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.classList.toggle("is-error", type === "error");
  formMessage.classList.toggle("is-warning", type === "warning");
}

function announce(message) {
  taskListStatus.textContent = "";
  window.setTimeout(() => {
    taskListStatus.textContent = message;
  }, 30);
}
