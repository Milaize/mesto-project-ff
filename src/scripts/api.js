const config = {
  baseUrl: 'https://nomoreparties.co/v1/wff-cohort-28',
  headers: {
    authorization: '39409349-87ca-4284-97d0-72553ea819f7',
    'Content-Type': 'application/json'
  }
}

const handleResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
};

// Загрузка информации о пользователе с сервера
export function fetchUserData() {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'GET',
    headers: config.headers,
  })
  .then((res) => handleResponse(res));
};

// Загрузка карточек
export function fetchCards() {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'GET',
    headers: config.headers,
  })
  .then((res) => handleResponse(res));
};

export function loadUserDataAndCards() {
  return Promise.all([fetchUserData(), fetchCards()]);
};

// Редактирование профиля
export function editUserProfile(name, about) {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({ name, about })
  }).then((res) => handleResponse(res));
};

//Добавление новой карточки
export const addNewCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({ name, link })
  }).then((res) => handleResponse(res));
};