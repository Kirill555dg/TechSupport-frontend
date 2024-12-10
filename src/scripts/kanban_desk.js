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




// console.log("РАБОТАЕМ!!!")

// // Моки задач
// const tasks = [
//   {
//     title: "Ошибка в логине",
//     description: "Пользователь не может войти в систему.",
//     userName: "Иван Иванов",
//     userEmail: "ivan.ivanov@example.com",
//     date: "2024-12-05",
//     type: "open",
//   },
//   {
//     title: "Неправильное отображение отчета",
//     description: "На странице отчета некорректные данные.",
//     userName: "Анна Смирнова",
//     userEmail: "anna.smirnova@example.com",
//     date: "2024-12-04",
//     type: "in_progress",
//     employee: "Иван Иванов",
//   },
//   {
//     title: "Ошибка экспорта",
//     description: "Файл не загружается при экспорте.",
//     userName: "Петр Петров",
//     userEmail: "petr.petrov@example.com",
//     date: "2024-12-03",
//     type: "on_hold",
//     employee: "Иван Иванов",
//   },
//   {
//     title: "Успешное исправление UI",
//     description: "Доработка интерфейса завершена.",
//     userName: "Светлана Орлова",
//     userEmail: "svetlana.orlova@example.com",
//     date: "2024-12-02",
//     type: "done",
//   },
//   {
//     title: "Проблема с регистрацией",
//     description: "При попытке регистрации нового пользователя появляется ошибка валидации полей, что не позволяет завершить процесс регистрации.",
//     userName: "Дмитрий Кузнецов",
//     userEmail: "dmitry.kuznetsov@example.com",
//     date: "2024-12-05",
//     type: "open",
//   },
//   {
//     title: "Длинное ожидание загрузки",
//     description: "После нажатия на кнопку 'Загрузить' процесс длится более минуты, что значительно ухудшает пользовательский опыт. Необходима оптимизация алгоритма обработки данных.",
//     userName: "Екатерина Иванова",
//     userEmail: "ekaterina.ivanova@example.com",
//     date: "2024-12-04",
//     type: "in_progress",
//     employee: "Иван Иванов",
//   },
//   {
//     title: "Сбой при отправке отчета",
//     description: "Отчеты не отправляются, если файл прикрепления превышает 10МБ. Необходимо увеличить лимит или сообщить пользователю о проблеме.",
//     userName: "Алексей Петров",
//     userEmail: "alexey.petrov@example.com",
//     date: "2024-12-03",
//     type: "done",
//   },
//   {
//     title: "Исправление багов отчета",
//     description: "Все известные ошибки отчета исправлены, в том числе некорректное отображение данных и несоответствие итогов ожидаемым значениям.",
//     userName: "Мария Сидорова",
//     userEmail: "maria.sidorova@example.com",
//     date: "2024-12-02",
//     type: "done",
//   },
// ];

// // Функция для добавления задач на доску
// function renderTasks(tasks) {
//   const template = document.getElementById("task-template");

//   // Сопоставление типа задачи с колонкой
//   const columns = {
//     open: document.querySelector(".kanban-column:nth-child(1) .kanban-column__list"),
//     in_progress: document.querySelector(".kanban-column:nth-child(2) .kanban-column__list"),
//     on_hold: document.querySelector(".kanban-column:nth-child(3) .kanban-column__list"),
//     done: document.querySelector(".kanban-column:nth-child(4) .kanban-column__list"),
//   };

//   tasks.forEach((task) => {
//     // Клонируем содержимое шаблона
//     const taskElement = template.content.cloneNode(true);

//     // Заполняем шаблон данными
//     taskElement.querySelector(".task__title").textContent = task.title;
//     taskElement.querySelector(".task__description").textContent = task.description;
//     taskElement.querySelector(".task__user-name").textContent = task.userName;
//     taskElement.querySelector(".task__user-email").textContent = task.userEmail;
//     taskElement.querySelector(".task__date").textContent = task.date;
//     taskElement.querySelector(".task__employee").textContent = task.employee;

//     // Определяем, в какую колонку добавить задачу
//     const column = columns[task.type];
//     if (column) {
//       column.appendChild(taskElement);
//     }
//   });
// }

// // Вызов функции рендера задач
// renderTasks(tasks);
