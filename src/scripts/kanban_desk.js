import '../pages/kanban_desk.css';

import { API_URL, API_APPLICATION_URL } from './routes.js';

const jwtToken = localStorage.getItem("jwtToken"); // Получение токена из localStorage
const role = localStorage.getItem("role");

console.log("jwt: ", jwtToken);
console.log("role", role);

if (!jwtToken || !["EMPLOYEE", "ADMIN"].includes(role)) {
  alert("Вы не авторизованы. Пожалуйста, войдите.");
  window.location.href = "/login.html"; // Редирект на страницу авторизации
}


const userInfoElement = document.querySelector(".user-info__employee");
const logoutButton = document.querySelector(".logout-button");

userInfoElement.textContent = localStorage.getItem("fullName");

logoutButton.addEventListener("click", () => {
  localStorage.clear();

  // Перенаправление на страницу авторизации
  window.location.href = "/login.html";
});

// GET: Получение списка задач
const columns = {
  NEW: document.querySelector(".kanban-column:nth-child(1) .kanban-column__list"),
  IN_PROGRESS: document.querySelector(".kanban-column:nth-child(2) .kanban-column__list"),
  ON_HOLD: document.querySelector(".kanban-column:nth-child(3) .kanban-column__list"),
  DONE: document.querySelector(".kanban-column:nth-child(4) .kanban-column__list"),
};

const fetchTasks = async () => {
  console.log(jwtToken)
  try {
    const response = await fetch(`${API_URL}${API_APPLICATION_URL}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при загрузке задач.");
    }

    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error("Ошибка загрузки задач:", error);
    alert("Не удалось загрузить задачи. Попробуйте позже.");
  }
};

const renderTasks = (tasks) => {
  const template = document.getElementById("task-template");

  Object.values(columns).forEach((column) => (column.innerHTML = ""));

  tasks.forEach((task) => {
    console.log(task);
    const taskElement = template.content.cloneNode(true);

    // Заполнение данных задачи
    taskElement.querySelector(".task__title").textContent = task.title;
    taskElement.querySelector(".task__description-text").textContent = task.description;
    taskElement.querySelector(".task__user-name").textContent = `${task.name}`;
    taskElement.querySelector(".task__user-email").textContent = `${task.email}`;
    taskElement.querySelector(".task__date").textContent = new Date(task.dateOfCreation).toLocaleDateString();

    const employeeName = taskElement.querySelector(".task__employee-name");
    const employeeEmail = taskElement.querySelector(".task__employee-email");

    // Проверка на наличие сотрудника
    if (task.employeeName && task.employeeEmail) {
      employeeName.textContent = `${task.employeeName}`;
      employeeEmail.textContent = `${task.employeeEmail}`;
    } else {
      employeeName.textContent = "Не назначен";
      employeeEmail.textContent = "";
    }

    const assignButton = taskElement.querySelector(".task__button");
    assignButton.addEventListener("click", () => assignTask(task.id));

    const column = columns[task.status];
    console.log(column);
    if (column) {
      column.appendChild(taskElement);
    }
  });
};

const assignTask = async (taskId) => {
  try {
    const response = await fetch(`${API_URL}${API_APPLICATION_URL}/${taskId}/assign`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Не удалось взять задачу.");
    }

    fetchTasks();
  } catch (error) {
    console.error("Ошибка взятия задачи:", error);
    alert("Не удалось взять задачу. Попробуйте снова.");
  }
};

fetchTasks();
