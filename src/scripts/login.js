import '../pages/login.css';

import { enableValidation, checkValidation } from './validate.js';
import { openModal, closeModal } from './modal.js';



const API_URL = "http://localhost:8000";
const API_AUTH_URL = "/api/v1/auth";
const API_USER_URL = "/api/v1/user";
// Поп-ап
const signInPopup = document.querySelector('.popup_type_sign-in');
const signUpPopup = document.querySelector('.popup_type_sign-up');

// Кнопки вызова поп-апов
const loginContainerButton = document
  .querySelector('.login-container__identity')
  .querySelector('.login-container__button');

const singUpButton = signInPopup.querySelector('.popup__link');

//// Обработка поп-апа ////

// Обработка поп-апа изменения профиля
const signInFormElement = document.forms.signin;
const signUpFormElement = document.forms.signup;

const passwordSignUp = signUpFormElement.elements.password;
const confirmPasswordSignUp = signUpFormElement.elements.confirmPassword;


confirmPasswordSignUp.addEventListener('input', evt => {
  console.log('input');
  confirmPasswordSignUp.setCustomValidity(
    confirmPasswordSignUp.value !== passwordSignUp.value ? 'Пароли не совпадают' : ''
  );
});


loginContainerButton.addEventListener('click', evt => {
  checkValidation(signInFormElement, validationSettings);
  openModal(signInPopup);
});

singUpButton.addEventListener('click', evt => {
  closeModal(signInPopup);
  checkValidation(signUpFormElement, validationSettings);
  openModal(signUpPopup);
});

// Helper to handle responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Произошла ошибка, попробуйте снова.");
  }
  return response.json();
};

async function setToken(email, password) {
  const response = await fetch(`${API_URL}${API_AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);
  console.log(data);
  localStorage.setItem("jwtToken", data.token);
}

async function setRole() {
  const token = localStorage.getItem("jwtToken");
  const response = await fetch(`${API_URL}${API_USER_URL}/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const profileInfo = await handleResponse(response);
  localStorage.setItem("role", profileInfo.role)
  localStorage.setItem("fullName", profileInfo.fullName);
}

// Прикрепление обработчика к форме
signInFormElement.addEventListener('submit', async (evt) => {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

  const email = signInFormElement.email.value;
  const password = signInFormElement.password.value;

  try {
    await setToken(email, password);
    await setRole();
    const role = localStorage.getItem("role");
    alert("Вы успешно авторизовались.");
    if (["CLIENT"].includes(role)) {
      window.location.href = "/submited_tasks.html"; // Редирект на страницу авторизации
    } else if (["EMPLOYEE", "ADMIN"].includes(role)) {
      window.location.href = "/kanban_desk.html"; // Редирект на страницу авторизации
    }
  } catch (error) {
    alert(error.message);
  }

});

signUpFormElement.addEventListener('submit', async (evt) => {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

  const firstName = signUpFormElement["first-name"].value;
  const lastName = signUpFormElement["last-name"].value;
  const middleName = signUpFormElement["middle-name"].value;
  const email = signUpFormElement.email.value;
  const password = signUpFormElement.password.value;

  try {
    const response = await fetch(`${API_URL}${API_AUTH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        middleName,
        email,
        password,
      }),
    });

    const data = await handleResponse(response);
    console.log(data);
    alert("Вы успешно зарегистрировались.");
    // Optionally log in user after registration or update UI
  } catch (error) {
    alert(error.message);
  }
});

// Создание объекта с настройками валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
}

// включение валидации вызовом enableValidation
// все настройки передаются при вызове
enableValidation(validationSettings);
