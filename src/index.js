import './pages/index.css';
import { createCard, deleteCard, handleLikeClick } from './scripts/card.js';
import { openModal, closeModal } from './scripts/modal.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { 
  fetchUserData, fetchCards, loadUserDataAndCards, editUserProfile, addNewCard, deleteOwnCard,
} from './scripts/api.js';

// Глобальные переменные
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
const linkInput = addForm.querySelector(".popup__input_type_url");
let profileId;

// Основная логика для карточек
// Вывести карточки на страницу
function fillCards(initialCards, profileId) {
  initialCards.forEach((cardData) => {
    const cardElement = createCard(
      cardData,
      (card) => deleteCard(card, cardData._id),
      handleLikeClick,
      handleImageClick,
      profileId
    );
    placesList.append(cardElement);
  });
}

// Обработка клика по изображению
function handleImageClick(cardData) {
  if (!popupImageElement || !popupCaptionElement) {
    console.error("Элементы изображения модального окна не найдены");
    return;
  }
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaptionElement.textContent = cardData.name;

  openModal(popupImage);
}

// Добавляем новые карточки
addForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const cardData = {
    name: cardInput.value,
    link: linkInput.value,
  };
  const cardElement = createCard(
    cardData,
    deleteCard,
    handleLikeClick,
    handleImageClick,
    profileId
  );
  placesList.prepend(cardElement);
  closeModal(newCardPopup);
});

// Функция загрузки карточек с сервера
function addLoadingCards(evt) {
  evt.preventDefault();
  const cardValue = cardInput.value;
  const linkValue = linkInput.value;
  addNewCard(cardValue, linkValue)
    .then((cardData) => {
      const newCard = createCard(
        cardData,
        deleteCard,
        handleLikeClick,
        handleImageClick,
        profileId
      );
      placesList.prepend(newCard);
      closeModal(newCardPopup);
    })
    .catch((error) => {
      console.log(error);
    });
}
addForm.addEventListener('submit', addLoadingCards);

// Открытие попапа редактирования профиля
profileEditButton.addEventListener('click', () => {
  if (profileTitle && profileDescription) {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
  }
  openModal(editPopup);
});

// Открытие попапа добавления нового места
profileAddButton.addEventListener('click', () => {
  clearValidation(newCardForm, validationConfig); // Очищаем старые ошибки
  newCardForm.reset(); // Сбрасываем поля формы
  openModal(newCardPopup);
});

// Обработчик отправки формы профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  editUserProfile(nameValue, jobValue)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closeModal(editPopup);
    })
    .catch((error) => {
      console.log(error);
    });
}
profileForm.addEventListener('submit', handleProfileFormSubmit);

//смена аватара


// Основная логика для валидации
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible',
};
enableValidation(validationConfig);

popupCloseButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Очистка ошибок валидации при закрытии попапа редактирования профиля
    if (button.closest('.popup_type_edit')) {
      clearValidation(profileForm, validationConfig); // Очистка ошибок для формы редактирования профиля
    }
  });
});

// API
loadUserDataAndCards()
  .then(([userList, initialCards]) => {
    profileTitle.textContent = userList.name;
    profileDescription.textContent = userList.about;
    profileId = userList._id;
    profileImage.style.backgroundImage = `url(${userList.avatar})`;
    fillCards(initialCards, profileId);
  })
  .catch((error) => {
    console.log(error);
  });