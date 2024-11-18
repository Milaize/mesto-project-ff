import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, deleteCard } from './scripts/cards.js';
import { openModal, closeModal } from './scripts/modal.js';

const placesList = document.querySelector('.places__list');

const editPopup = document.querySelector('.popup_type_edit');  
const newCardPopup = document.querySelector('.popup_type_new-card');  
const profileEditButton = document.querySelector('.profile__edit-button');  
const profileAddButton = document.querySelector('.profile__add-button');  
const popupCloseButtons = document.querySelectorAll('.popup__close'); 
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const nameInput = document.querySelector('.popup__input_type_name'); 
const jobInput = document.querySelector('.popup__input_type_description'); 
const formElement = document.querySelector('.popup__form'); 


// основная логика для карточек
// Вывести карточки на страницу
initialCards.forEach(function (cardData) {
  placesList.append(createCard(cardData, deleteCard));
});

// основная логика для модальных окон
  // Открытие попапа редактирования профиля 
profileEditButton.addEventListener('click', () => { 
    if (profileTitle && profileDescription) { 
      nameInput.value = profileTitle.textContent; 
      jobInput.value = profileDescription.textContent; 
    }    openModal(editPopup); 
  }); 
 
  // Открытие попапа добавления нового места 
  profileAddButton.addEventListener('click', () => { 
    openModal(newCardPopup); 
  }); 

//обработчик события submit при отправке формы
function handleFormSubmit(evt) {  
evt.preventDefault(); // Отменяем стандартное поведение формы  
// Получаем значения полей формы  
const nameValue = nameInput.value; 
const jobValue = jobInput.value;  
// Выбираем элементы профиля на странице, куда вставим новые значения  
const profileTitle = document.querySelector('.profile__title'); // Заголовок профиля 
const profileDescription = document.querySelector('.profile__description'); // Описание профиля / 
profileTitle.textContent = nameValue; 
profileDescription.textContent = jobValue;  
// Закрываем попап после обновления  
const popup = formElement.closest('.popup'); 
popup.classList.remove('popup_is-opened'); } 
 // Прикрепляем обработчик к форме  
formElement.addEventListener('submit', handleFormSubmit);







