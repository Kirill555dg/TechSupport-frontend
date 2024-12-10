
import { API_URL, API_APPLICATION_URL } from './routes.js';

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
    const response = await fetch(`${API_URL}${API_APPLICATION_URL}/create`, {
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
