export function createCard(cardData, deleteCard, handleLikeClick, handleImageClick, profileId) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const likeButton = cardElement.querySelector('.card__like-button');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const cardId = cardData._id;

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
 

  // Удаление карточки
  deleteButton.addEventListener('click', () => {
    deleteCard(cardElement);
  });

  // Лайк карточки
  likeButton.addEventListener('click', () => { 
    handleLikeClick(likeButton);
  }); 

  // Открытие изображения при клике
  cardImage.addEventListener('click', () => {
    handleImageClick(cardData);
  });

  return cardElement;
}

export function deleteCard(card) {
  card.remove();
}

export function handleLikeClick (likeButton) {
  likeButton.classList.toggle('card__like-button_is-active');
}