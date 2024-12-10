import '../pages/assigned_tasks.css';

import { API_URL, API_APPLICATION_URL } from './routes.js';


console.log("РАБОТАЕМ!!!")

const jwtToken = localStorage.getItem("jwtToken"); // Получение токена из localStorage
const role = localStorage.getItem("role");

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

const styles = {
  NEW: "tasks__item_type_new",
  IN_PROGRESS: "tasks__item_type_in-progress",
  ON_HOLD: "tasks__item_type_on-hold",
  DONE: "tasks__item_type_done",
};


// DOM элементы
const tasksContainer = document.querySelector(".tasks");

const fetchTasks = async () => {
  try {
    const response = await fetch(`${API_URL}${API_APPLICATION_URL}/employee`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Ошибка при загрузке задач. Проверьте права доступа.");
    }

    const tasks = await response.json();
    console.log("Полученные задачи:", tasks);
    // Очистить контейнер задач
    tasksContainer.innerHTML = "";

    // Рендер задач
    renderTasks(tasks);
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error);
    alert("Не удалось загрузить задачи. Попробуйте снова.");
  }
};

const renderTasks = (tasks) => {
  // Получаем шаблон задачи
  const template = document.getElementById("task-template");

  // Получаем список задач внутри workzone
  const taskList = document.querySelector(".workzone .tasks");

  // Очищаем список задач перед добавлением новых
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    // Клонируем содержимое шаблона задачи
    const taskElement = template.content.cloneNode(true);
    console.log(taskElement);
    // Заполняем данные задачи
    taskElement.querySelector(".task__title").textContent = task.title;
    taskElement.querySelector(".task__creation-date").textContent = new Date(task.dateOfCreation).toLocaleDateString();
    taskElement.querySelector(".task__status").textContent = task.status;
    taskElement.querySelector(".task").classList.add(styles[task.status]);
    taskElement.querySelector(".task__description").textContent = task.description;
    taskElement.querySelector(".task__user-name").textContent = task.name;
    taskElement.querySelector(".task__user-email").textContent = task.email;

    // Добавляем обработчики событий на кнопки действий
    taskElement.querySelector(".task__progress-button").addEventListener("click", () => updateTaskStatus(task.id, "IN_PROGRESS"));
    taskElement.querySelector(".task__hold-button").addEventListener("click", () => updateTaskStatus(task.id, "ON_HOLD"));
    taskElement.querySelector(".task__complete-button").addEventListener("click", () => updateTaskStatus(task.id, "DONE"));

    // Добавляем задачу в список задач
    taskList.appendChild(taskElement);
  });

  console.log(taskList);
};


// PUT: Обновление статуса задачи
const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await fetch(`${API_URL}${API_APPLICATION_URL}/${taskId}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        status
      }),
    });

    if (!response.ok) {
      throw new Error("Не удалось обновить статус задачи");
    }

    // Перезагрузить список задач
    fetchTasks();
  } catch (error) {
    console.error("Ошибка обновления статуса задачи:", error);
  }
};


fetchTasks();
