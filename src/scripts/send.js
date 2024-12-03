export default async function sendData(name, email, title, description) {

  try {
    // Создаем объект данных для отправки
    const application = {
      name: name,
      email: email,
      title: title,
      description: description
    };

    console.log(JSON.stringify(application))

    // Отправляем POST-запрос на сервер
    const response = await fetch("http://localhost:8000/api/v1/application/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    });

    // Проверяем успешность запроса
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
    }

    const result = await response.json(); // Получаем результат
    console.log("Задача успешно создана:", result);

    // Возвращаем результат, чтобы использовать его в UI
    return {
      success: true,
      message: "Задача успешно создана!",
    };
  } catch (error) {
    console.error("Ошибка при создании задачи:", error.message);

    // Возвращаем информацию об ошибке
    return {
      success: false,
      message: error.message || "Неизвестная ошибка при создании задачи",
    };
  }
}

// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const formData = new FormData(form);

//   // Формируем объект для отправки
//   const taskData = {
//     fio: formData.get('fio'),
//     email: formData.get('email'),
//     title: formData.get('title'),
//     description: formData.get('description'),
//   };

//   try {
//     const response = await fetch('http://localhost:8080/api/tasks', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(taskData),
//     });

//     if (response.ok) {
//       alert('Задача успешно отправлена!');
//       form.reset();
//     } else {
//       const error = await response.json();
//       alert(`Ошибка: ${error.message}`);
//     }
//   } catch (err) {
//     console.error('Ошибка соединения:', err);
//     alert('Не удалось соединиться с сервером.');
//   }
// });
