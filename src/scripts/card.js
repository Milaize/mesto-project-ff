import { likeCard, unlikeCard, deleteOwnCard} from './api.js';

export function createCard(cardData, deleteCard, handleLikeClick, handleImageClick, profileId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCounter = cardElement.querySelector('.card__like-counter');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  
  const cardId = cardData._id || null; // Безопасное присвоение
  const likes = Array.isArray(cardData.likes) ? cardData.likes : [];

  // Устанавливаем данные карточки
  cardImage.src = cardData.link || ''; // Подстраховка от undefined
  cardImage.alt = cardData.name || 'Изображение';
  cardTitle.textContent = cardData.name || 'Без названия';
  likeCounter.textContent = likes.length; 

  // Проверяем, лайкнул ли текущий пользователь карточку
  if (likes.some(user => user._id === profileId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Показываем кнопку удаления только если карточка принадлежит текущему пользователю
  if (cardData.owner && cardData.owner._id === profileId) {
    deleteButton.style.display = 'block'; 
  } else {
    deleteButton.style.display = 'none';
  }

  // Удаление карточки
  if (cardId) {
    deleteButton.addEventListener('click', () => {
      deleteCard(cardElement, cardId);
    });
  } else {
    deleteButton.style.display = 'none'; // Скрыть кнопку удаления, если нет ID
  }

  // Лайк карточки
  likeButton.addEventListener('click', () => { 
    if (cardId) {
      handleLikeClick(likeButton, cardId, likeCounter);
    } else {
      console.error('Нет ID для управления лайками');
    }
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