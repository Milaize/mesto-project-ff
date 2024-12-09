import './pages/index.css';
import { initialCards } from './scripts/cards.js';
import { createCard, deleteCard, handleLikeClick } from './scripts/card.js';
import { openModal, closeModal } from './scripts/modal.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { 
  fetchUserData, fetchCards, loadUserDataAndCards,  editUserProfile, addNewCard
} from './scripts/api.js';

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
const profileImage = document.querySelector(".profile__image");
const addForm = document.querySelector('form[name="new-place"]');
const cardTemplateContent = document.querySelector('#card-template').content;
const newCardForm = document.querySelector('.popup_type_new-card .popup__form');
const cardInput = addForm.querySelector(".popup__input_type_card-name");
let profileId;


// основная логика для карточек 
// Вывести карточки на страницу 
initialCards.forEach(function (cardData) { 
  placesList.append(createCard(cardData, deleteCard, handleLikeClick, handleImageClick, profileId)); 
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
 
function addCard(
  cardData,
  placesList,
  cardTemplateContent,
  createCard,
  // likeCard,
  // showImgPopup,
  // openDeletePopup,
  profileId
) {
  const cardElement = createCard(
    cardData,
    cardTemplateContent,
    // likeCard,
    // showImgPopup,
    // openDeletePopup,
    profileId
  );
  placesList.append(cardElement);
}

newPlaceElement.addEventListener('submit', addCard); 

//Функция заполнения страницы карточками
function fillCards(initialCards, profileId) {
  initialCards.forEach((cardData) => {
    addCard(
      cardData,
      placesList,
      cardTemplateContent,
      createCard,
      // likeCard,
      // showImgPopup,
      // openDeletePopup,
      profileId
    );
  });
}

// Функция загрузки с сервера и добавления карточек на страницу
function addLoadingCards(evt) {
  evt.preventDefault();
  const cardValue = cardInput.value;
  const linkValue = linkInput.value;
  addNewCard(cardValue, linkValue)
    .then((card) => {
      const newCard = createCard(
        cardData,
        cardTemplateContent,
        // likeCard,
        // showImgPopup,
        // openDeletePopup,
        profileId
      );
      placesList.prepend(newCard);
      closeModal(addCardPopup);
    })
    .catch((error) => {
      console.log(error);
    })
}
addForm.addEventListener("submit", addLoadingCards);

// основная логика для модальных окон 
const popup = profileForm.closest('.popup');  
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
function handleProfileFormSubmit(evt) {   
evt.preventDefault(); // Отменяем стандартное поведение формы   
// Получаем значения полей формы   
const nameValue = nameInput.value;  
const jobValue = jobInput.value;   
// Выбираем элементы профиля на странице, куда вставим новые значения    
profileTitle.textContent = nameValue;  
profileDescription.textContent = jobValue;   
editUserProfile(nameValue, jobValue)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closeModal(popup);
    })
    .catch((error) => {
      console.log(error);
    })
}
// Закрываем попап после обновления   

 // Прикрепляем обработчик к форме   
 profileForm.addEventListener('submit', handleProfileFormSubmit);

// основная логика для валидации
// Конфигурация для валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};

// Включение валидации
enableValidation(validationConfig);

document.querySelector('.profile__edit-button').addEventListener('click', () => {
  clearValidation(profileForm, validationConfig); // Очищаем старые ошибки
});

document.querySelector('.profile__add-button').addEventListener('click', () => {
  clearValidation(newCardForm, validationConfig); // Очищаем старые ошибки
  newCardForm.reset(); // Сбрасываем поля формы
});

//API
// Загрузка данных и карточек с использованием Promise.all()
loadUserDataAndCards()
  .then((array) => {
    const [userList, initialCards] = array;
    profileTitle.textContent = userList.name;
    profileDescription.textContent = userList.about;
    profileId = userList._id;
    profileImage.style.backgroundImage = `url(${userList.avatar})`;
    fillCards(initialCards, profileId);
  })
  .catch((error) => {
    console.log(error);
  });
