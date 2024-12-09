// Функция для проверки валидности поля
const checkInputValidity = (formElement, inputElement, config) => {
  const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
  if (!inputElement.validity.valid) {
    let errorMessage;

    // Проверка различных состояний `validity`
    if (inputElement.validity.valueMissing) {
      errorMessage = 'Вы пропустили это поле.';
    } else if (inputElement.validity.patternMismatch) {
      errorMessage = inputElement.dataset.errorMessage;
    } else {
      errorMessage = inputElement.validationMessage; // Стандартное сообщение браузера
    }

    // Добавляем класс ошибки и выводим сообщение
    inputElement.classList.add(config.inputErrorClass);
    errorElement.textContent = errorMessage;
    errorElement.classList.add(config.errorClass);
  } else {
    // Убираем сообщение об ошибке
    inputElement.classList.remove(config.inputErrorClass);
    errorElement.textContent = '';
    errorElement.classList.remove(config.errorClass);
  }
};

// Функция для переключения состояния кнопки отправки
const toggleButtonState = (formElement, config) => {
  const submitButton = formElement.querySelector(config.submitButtonSelector);
  const isFormValid = formElement.checkValidity();
  if (!isFormValid) {
    submitButton.classList.add(config.inactiveButtonClass);
    submitButton.disabled = true;
  } else {
    submitButton.classList.remove(config.inactiveButtonClass);
    submitButton.disabled = false;
  }
};

// Добавление обработчиков для всех полей формы
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(formElement, config);
    });
  });
};

// Включение валидации для всех форм
export const enableValidation = (config) => {
  const forms = document.querySelectorAll(config.formSelector);
  forms.forEach((formElement) => {
    setEventListeners(formElement, config);
    toggleButtonState(formElement, config);
  });
};

// Очистка ошибок валидации и сброс состояния кнопки
export const clearValidation = (formElement, config) => {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const errorList = Array.from(formElement.querySelectorAll(`.${config.errorClass}`));
  const submitButton = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.classList.remove(config.inputErrorClass);
    const errorElement = formElement.querySelector(`#${inputElement.id}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove(config.errorClass);
    }
  });

  submitButton.classList.add(config.inactiveButtonClass);
  submitButton.disabled = true;
};