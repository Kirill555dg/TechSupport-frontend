import '../pages/support.css';

console.log("РАБОТАЕМ!!!")

// Моки задач
const tasks = [
  {
    title: "Ошибка в логине",
    description: "Пользователь не может войти в систему.",
    userName: "Иван Иванов",
    userEmail: "ivan.ivanov@example.com",
    date: "2024-12-05",
    type: "open",
  },
  {
    title: "Неправильное отображение отчета",
    description: "На странице отчета некорректные данные.",
    userName: "Анна Смирнова",
    userEmail: "anna.smirnova@example.com",
    date: "2024-12-04",
    type: "in_progress",
    employee: "Иван Иванов",
  },
  {
    title: "Ошибка экспорта",
    description: "Файл не загружается при экспорте.",
    userName: "Петр Петров",
    userEmail: "petr.petrov@example.com",
    date: "2024-12-03",
    type: "on_hold",
    employee: "Иван Иванов",
  },
  {
    title: "Успешное исправление UI",
    description: "Доработка интерфейса завершена.",
    userName: "Светлана Орлова",
    userEmail: "svetlana.orlova@example.com",
    date: "2024-12-02",
    type: "done",
  },
  {
    title: "Проблема с регистрацией",
    description: "При попытке регистрации нового пользователя появляется ошибка валидации полей, что не позволяет завершить процесс регистрации.",
    userName: "Дмитрий Кузнецов",
    userEmail: "dmitry.kuznetsov@example.com",
    date: "2024-12-05",
    type: "open",
  },
  {
    title: "Длинное ожидание загрузки",
    description: "После нажатия на кнопку 'Загрузить' процесс длится более минуты, что значительно ухудшает пользовательский опыт. Необходима оптимизация алгоритма обработки данных.",
    userName: "Екатерина Иванова",
    userEmail: "ekaterina.ivanova@example.com",
    date: "2024-12-04",
    type: "in_progress",
    employee: "Иван Иванов",
  },
  {
    title: "Сбой при отправке отчета",
    description: "Отчеты не отправляются, если файл прикрепления превышает 10МБ. Необходимо увеличить лимит или сообщить пользователю о проблеме.",
    userName: "Алексей Петров",
    userEmail: "alexey.petrov@example.com",
    date: "2024-12-03",
    type: "done",
  },
  {
    title: "Исправление багов отчета",
    description: "Все известные ошибки отчета исправлены, в том числе некорректное отображение данных и несоответствие итогов ожидаемым значениям.",
    userName: "Мария Сидорова",
    userEmail: "maria.sidorova@example.com",
    date: "2024-12-02",
    type: "done",
  },
];

// Функция для добавления задач на доску
function renderTasks(tasks) {
  const template = document.getElementById("task-template");

  // Сопоставление типа задачи с колонкой
  const columns = {
    open: document.querySelector(".kanban-column:nth-child(1) .kanban-column__list"),
    in_progress: document.querySelector(".kanban-column:nth-child(2) .kanban-column__list"),
    on_hold: document.querySelector(".kanban-column:nth-child(3) .kanban-column__list"),
    done: document.querySelector(".kanban-column:nth-child(4) .kanban-column__list"),
  };

  tasks.forEach((task) => {
    // Клонируем содержимое шаблона
    const taskElement = template.content.cloneNode(true);

    // Заполняем шаблон данными
    taskElement.querySelector(".task__title").textContent = task.title;
    taskElement.querySelector(".task__description").textContent = task.description;
    taskElement.querySelector(".task__user-name").textContent = task.userName;
    taskElement.querySelector(".task__user-email").textContent = task.userEmail;
    taskElement.querySelector(".task__date").textContent = task.date;
    taskElement.querySelector(".task__employee").textContent = task.employee;

    // Определяем, в какую колонку добавить задачу
    const column = columns[task.type];
    if (column) {
      column.appendChild(taskElement);
    }
  });
}

// Вызов функции рендера задач
renderTasks(tasks);
