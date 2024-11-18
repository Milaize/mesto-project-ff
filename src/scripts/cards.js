import { openModal} from './modal.js';

export const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];


//Функция создания карточки
export function createCard(cardData, deleteCard, handleLikeClick, handleImageClick) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const popupImage = document.querySelector('.popup_type_image');
  const popupCaptionElement = popupImage.querySelector('.popup__caption');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardElement.querySelector('.card__title').textContent = cardData.name;

  cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
    deleteCard(cardElement);
  }) 

  // Функция обработчика лайка
  likeButton.addEventListener('click', () => {
  likeButton.classList.toggle('card__like-button_is-active');
  });

  // Функция обработчика клика по изображению
  cardImage.addEventListener('click', () => {
    const popupImageElement = popupImage.querySelector('.popup__image');
    popupImageElement.src = cardData.link;
    popupImageElement.alt = cardData.name;
    popupCaptionElement.textContent = cardData.name;
    openModal(popupImage);
  });

  return cardElement;
}

//Функция удаления карточки
export function deleteCard(card) { 
  card.remove()
}


