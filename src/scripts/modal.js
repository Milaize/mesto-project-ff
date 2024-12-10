function openModal(popup) {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeModalByEscape);
  popup.addEventListener("click", closeModalByClick);
  popup.addEventListener("click", closeModalByOverlay);
}

function closeModal(popup) {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeModalByEscape);
  popup.removeEventListener("click", closeModalByClick);
  popup.removeEventListener("click", closeModalByOverlay);
}


function closeModalByEscape(event) {
  if (event.key === "Escape") {
    const popup = document.querySelector(".popup_is-opened");
    closeModal(popup);
  }
}

function closeModalByClick(event) {
  const popup = document.querySelector(".popup_is-opened");
  if (event.target.classList.contains("popup__close")) {
    closeModal(popup);
  }
}

function closeModalByOverlay(event) {
  if (event.target === event.currentTarget) {
    closeModal(event.target);
  }
}

export { openModal, closeModal };
