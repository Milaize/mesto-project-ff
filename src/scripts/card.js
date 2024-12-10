import { likeCard, unlikeCard, deleteOwnCard} from './api.js';

export function createCard(cardData, deleteCard, handleLikeClick, handleImageClick, profileId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardId = cardData._id;
  const likes = Array.isArray(cardData.likes) ? cardData.likes : [];

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCounter.textContent = likes.length; // Отображаем количество лайков из ответа сервера

  // Показываем кнопку удаления только если карточка принадлежит текущему пользователю
  if (cardData.owner._id === profileId) {
    deleteButton.style.display = 'block'; 
  } else {
    deleteButton.style.display = 'none';
  }

  // Удаление карточки
  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });

  // Лайк карточки
  likeButton.addEventListener('click', () => { 
    handleLikeClick(likeButton, cardId, likeCounter);
  });

  // Открытие изображения при клике
  cardImage.addEventListener('click', () => {
    handleImageClick(cardData);
  });

  return cardElement;
}

export function deleteCard(card, cardId) {
  deleteOwnCard(cardId)
    .then(() => {
      card.remove();
    })
    .catch((err) => {
      console.log('Ошибка при удалении карточки:', err);
    });
}

export function handleLikeClick(likeButton, cardId, likeCounter) {
  // Проверяем, активен ли лайк
  const isLiked = likeButton.classList.contains('card__like-button_is-active');

  if (isLiked) {
    unlikeCard(cardId)
      .then(card => {
        likeButton.classList.remove('card__like-button_is-active');
        likeCounter.textContent = card.likes.length; // Обновляем количество лайков из ответа сервера
      })
      .catch(err => console.log('Ошибка при снятии лайка:', err));
  } else {
    likeCard(cardId)
      .then(card => {
        likeButton.classList.add('card__like-button_is-active');
        likeCounter.textContent = card.likes.length; // Обновляем количество лайков из ответа сервера
      })
      .catch(err => console.log('Ошибка при постановке лайка:', err));
  }
}