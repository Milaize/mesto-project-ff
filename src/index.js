import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, deleteCard, handleLikeClick } from './scripts/card.js';
import { openModal, closeModal } from './scripts/modal.js';

//Глобальные переменные
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
const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const popupImage = document.querySelector('.popup_type_image'); 
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaptionElement = popupImage.querySelector('.popup__caption');

// основная логика для карточек 
// Вывести карточки на страницу 
initialCards.forEach(function (cardData) { 
  placesList.append(createCard(cardData, deleteCard, handleLikeClick, handleImageClick)); 
}); 

//Обработка клика по изображению
function handleImageClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaptionElement.textContent = cardData.name;

  openModal(popupImage);
}

// добавляем новые карточки 
const newPlaceElement = document.querySelector('.popup__form[name="new-place"]'); 
const placeInput = newPlaceElement.querySelector('input[name="place-name"]'); 
const linkInput = newPlaceElement.querySelector('input[name="link"]'); 
const popupNewCard = document.querySelector('.popup_type_new-card');
 
function addCard(evt) { 
  evt.preventDefault(); 
  const place = placeInput.value.trim(); 
  const link = linkInput.value.trim(); 
  
  if (place && link) { 
    const newCard = createCard({ name: place, link: link }, deleteCard) 
    placesList.prepend(newCard); 
    closeModal(popupNewCard);
    newPlaceElement.reset(); 
  } 
} 

newPlaceElement.addEventListener('submit', addCard); 

// основная логика для модальных окон 
// Открытие попапа редактирования профиля  
profileEditButton.addEventListener('click', () => {  
  if (profileTitle && profileDescription) {  
    nameInput.value = profileTitle.textContent;  
    jobInput.value = profileDescription.textContent; 
    } openModal(editPopup); 
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
profileTitle.textContent = nameValue;  
profileDescription.textContent = jobValue;   
// Закрываем попап после обновления   
const popup = profileForm.closest('.popup');  
popup.classList.remove('popup_is-opened'); }  
 // Прикрепляем обработчик к форме   
 profileForm.addEventListener('submit', handleFormSubmit);