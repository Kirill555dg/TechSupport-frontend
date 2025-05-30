import '../pages/new_task.css';

import { enableValidation, checkValidation} from './validate.js'
import sendData from './send.js'

console.log("Somebody once told me the world is gonna roll me")

const jwtToken = localStorage.getItem("jwtToken"); // Получение токена из localStorage

document.querySelector('.login-button').addEventListener("click", () => {
  // Перенаправление на страницу авторизации
  window.location.href = "/login.html";
});

document.querySelector('.back-button').addEventListener("click", () => {
  // Перенаправление на страницу авторизации
  window.location.href = "/submited_tasks.html";
});


// Обработка формы отправки заявки
const applicationFormElement = document.querySelector('.application__form')

const nameInput = applicationFormElement.querySelector('.application__input_type_name')
const emailInput = applicationFormElement.querySelector('.application__input_type_email')
const titleInput = applicationFormElement.querySelector('.application__input_type_title')
const descriptionInput = applicationFormElement.querySelector('.application__input_type_description')

const applicationButton = applicationFormElement.querySelector('.application__button')
const applicationMessageBox = applicationFormElement.querySelector('.application__message-box')
const applicationStatus = applicationMessageBox.querySelector('.application__status')
const applicationResponse = applicationMessageBox.querySelector('.application__response')

if (jwtToken) {
  console.log('авторизован');
  console.log(localStorage.getItem("fullName"));
  nameInput.value = localStorage.getItem("fullName");
  nameInput.classList.add('disable-input');
  nameInput.readOnly = true;

  emailInput.value = localStorage.getItem("email");
  emailInput.classList.add('disable-input');
  emailInput.readOnly = true;
}

// Обработчик «отправки» формы
async function handleApplicationFormSubmit(evt) {
  evt.preventDefault() // Эта строчка отменяет стандартную отправку формы.

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  console.log("Ваше ФИО: " + name);
  console.log("Ваша почта: " + email);
  console.log("Суть ошибки: " + title);
  console.log("Описание ошибки: " + description);

  const result = await sendData(name, email, title, description);

  if (result.success) {
    applicationMessageBox.classList.remove('application__message-box_type_error')
    applicationMessageBox.classList.add('application__message-box_type_success')
    applicationResponse.textContent = result.message; // Показываем сообщение об ошибке
     // Проверяем валидацию
    applicationFormElement.reset()
    checkValidation(applicationFormElement, validationSettings);

  } else {
    applicationMessageBox.classList.remove('application__message-box_type_success')
    applicationMessageBox.classList.add('application__message-box_type_error')
    applicationResponse.textContent = result.message; // Показываем сообщение об ошибке
  }
}

// Прикрепление обработчика к форме
applicationFormElement.addEventListener('submit', handleApplicationFormSubmit)



const validationSettings = {
  formSelector: '.application__form',
  inputSelector: '.application__input',
  submitButtonSelector: '.application__button',
  inactiveButtonClass: 'application__button_disabled',
  inputErrorClass: 'application__input_type_error',
  errorClass: 'application__error_visible'
}

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings)
