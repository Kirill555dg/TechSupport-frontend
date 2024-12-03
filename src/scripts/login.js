import '../pages/login.css';

import { enableValidation, checkValidation } from './validate.js';
import { openModal, closeModal } from './modal.js';


//// DOM-узлы ////


// Данные пользователя
// const profileTitle = document.querySelector('.profile__title')
// const profileDescription = document.querySelector('.profile__description')

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

const emailSignIn = signInFormElement.elements.email;
const passwordSignIn = signInFormElement.elements.password;

const emailSignUp = signUpFormElement.elements.email;
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

// Прикрепление обработчика к форме
signInFormElement.addEventListener('submit', evt => {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

  alert('Авторизация недоступна!');

  signInFormElement.reset();
});

signUpFormElement.addEventListener('submit', evt => {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.

  alert('Регистрация недоступна!');

  signUpFormElement.reset();
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
