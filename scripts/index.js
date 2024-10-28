// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
// @todo: Функция создания карточки
function createCard(cardData, deleteCard) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  cardElement.querySelector('.card__title').textContent = cardData.name;

  cardElement.querySelector('.card__delete-button').addEventListener('click', () => {
    deleteCard(cardElement);
  }) 

  return cardElement;
}
// @todo: Функция удаления карточки
function deleteCard(card) { 
  card.remove()
}
// @todo: Вывести карточки на страницу
initialCards.forEach(function (cardData) {
  placesList.append(createCard(cardData, deleteCard));
});
