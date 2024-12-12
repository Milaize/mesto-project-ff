import './pages/index.css';
import { createCard, deleteCard, handleLikeClick } from './scripts/card.js';
import { openModal, closeModal } from './scripts/modal.js';
import { enableValidation, clearValidation } from './scripts/validation.js';
import { 
  fetchUserData, fetchCards, loadUserDataAndCards, editUserProfile, addNewCard, deleteOwnCard, updateOwnAvatar
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
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarInput = document.querySelector('#avatarUrl');
const avatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const submitButton = avatarForm.querySelector('.popup__button');
const profileImageOverlay = document.querySelector('.profile__image-overlay');
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

// Функция загрузки карточек с сервера
function addLoadingCards(evt) {
  evt.preventDefault();

  const submitButton = evt.submitter;
  submitButton.textContent = 'Сохранение...';

  const cardValue = cardInput.value;
  const linkValue = linkInput.value;

  addNewCard(cardValue, linkValue)
    .then((cardData) => {
      if (cardData && cardData._id) { // Убедиться, что сервер вернул корректные данные
        const newCard = createCard(
          cardData,
          deleteCard,
          handleLikeClick,
          handleImageClick,
          profileId
        );
        placesList.prepend(newCard);
        closeModal(newCardPopup);
      } else {
        console.error('Сервер вернул некорректные данные карточки', cardData);
      }
    })
    .catch((error) => {
      console.error(`Ошибка добавления новой карточки: ${error}`);
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить';
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

  const submitButton = profileForm.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';

  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  editUserProfile(nameValue, jobValue)
    .then((res) => {
      profileTitle.textContent = res.name;
      profileDescription.textContent = res.about;
      closeModal(editPopup);
    })
    .catch((error) => {
      console.error(`Ошибка обновления профиля: ${error}`);
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
}
profileForm.addEventListener('submit', handleProfileFormSubmit);

//Смена аватара
// Функция для обработки клика на аватар и открытия формы редактирования
function handleProfileImageClick() {

  // Сбрасываем ошибки и поле ввода перед открытием
  clearValidation(avatarForm, validationConfig);
  avatarForm.reset();
  openModal(avatarPopup);
}

// Обработчик отправки формы изменения аватара
function handleAvatarFormSubmit(evt) {
  evt.preventDefault();

  // Изменяем текст кнопки на "Сохранение..." во время загрузки
  submitButton.textContent = 'Сохранение...';

  updateOwnAvatar(avatarInput.value)
    .then((res) => {
      profileImage.style.backgroundImage = `url(${res.avatar})`;
      closeModal(avatarPopup);
    })
    .catch((error) => {
      console.error(`Ошибка обновления аватара: ${error}`);
    })
    .finally(() => {
      // Возвращаем исходный текст кнопки после загрузки
      submitButton.textContent = 'Сохранить';
    });
}

// Добавляем обработчик клика на аватар
profileImageOverlay.addEventListener('click', handleProfileImageClick);

// Добавляем обработчик отправки формы изменения аватара
avatarForm.addEventListener('submit', handleAvatarFormSubmit);


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