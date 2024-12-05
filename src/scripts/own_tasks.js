import '../pages/support.css';

console.log("РАБОТАЕМ!!!")

// DOM элементы
const loginForm = document.forms.login;
const emailInput = loginForm.email;
const passwordInput = loginForm.password;
const loginMessageBox = document.querySelector(".login__response");
const tasksContainer = document.querySelector(".tasks");
const logoutButton = document.querySelector(".workzone__logout-button");
const taskTemplate = document.getElementById("task-template").content;

// Переменные для данных сотрудника
let employeeId = null;
let employeeData = null;

// POST: Авторизация сотрудника
const authorizeEmployee = async (email, password) => {
  console.log(JSON.stringify({ email, password }))
  try {
    const response = await fetch("http://localhost:8000/api/v1/employee/authorization", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Неверный логин или пароль");
    }

    const data = await response.json();
    employeeId = data.id;
    employeeData = data;

    // Успешная авторизация
    displayTasksSection();
    fetchTasks();
  } catch (error) {
    alert(error.message)
  }
};

// GET: Получение списка задач
const fetchTasks = async () => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/application/employee?id=${employeeId}`);
    const tasks = await response.json();

    // Очистить предыдущие задачи
    tasksContainer.innerHTML = "";

    // Добавить задачи в DOM
    tasks.forEach(renderTask);
  } catch (error) {
    console.error("Ошибка при загрузке задач:", error);
  }
};

const styles = {
  "NEW": "tasks__item_type_new",
  "IN_PROGRESS": "tasks__item_type_in-progress",
  "DONE": "tasks__item_type_done"
}

// Рендер задачи из шаблона
const renderTask = (task) => {

  const taskClone = taskTemplate.cloneNode(true);

  taskClone.querySelector(".task__title").textContent = `Задача: ${task.title}`;
  taskClone.querySelector(".task__user-name").textContent = `Имя: ${task.name}`;
  taskClone.querySelector(".task__user-email").textContent = `Почта: ${task.email}`;
  taskClone.querySelector(".task__description").textContent = `Описание: ${task.description}`;
  taskClone.querySelector(".task__status").textContent = `Статус: ${task.status}`;
  taskClone.querySelector('.tasks__item').classList.add(styles[task.status])

  console.log(taskClone)
  const progressButton = taskClone.querySelector(".task__progress-button");
  const completeButton = taskClone.querySelector(".task__complete-button");

  // Установить текст кнопок
  progressButton.textContent = "В процессе";
  completeButton.textContent = "Завершить";

  // Добавить обработчики событий для изменения статуса задачи
  progressButton.addEventListener("click", () => updateTaskStatus(task.id, "IN_PROGRESS"));
  completeButton.addEventListener("click", () => updateTaskStatus(task.id, "DONE"));

  tasksContainer.appendChild(taskClone);
};

// PUT: Обновление статуса задачи
const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/application/update?id=${taskId}&status=${status}`, {
      method: "PUT"
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

// Отображение раздела с задачами
const displayTasksSection = () => {
  document.querySelector(".login").style.display = "none"; // Скрыть форму входа
  document.querySelector(".workzone").style.display = "grid"; // Показать задачи
};

// Обработчик формы входа
loginForm.addEventListener("submit", (event) => {
  console.log("submit")
  event.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  authorizeEmployee(email, password);
});

// Обработчик кнопки "Выйти"
logoutButton.addEventListener("click", () => {
  // Сбросить интерфейс
  employeeId = null;
  employeeData = null;
  tasksContainer.innerHTML = "";
  document.querySelector(".login").style.display = "flex"; // Показать форму входа
  document.querySelector(".workzone").style.display = "none"; // Скрыть задачи
});
