let btns = document.querySelectorAll('[data-toggle="modal"');
let body = document.querySelector('body');
let closeBtns = document.querySelectorAll('.popup-close-btn');

const isMobileDevice = function isMobileDevice() {
  return (
    typeof window.orientation !== 'undefined' ||
    navigator.userAgent.indexOf('IEMobile') !== -1
  );
};

const closePopupByOuterClick = function closePopupByOuterClick(e) {
  let popup = document.querySelector('.popup.visible');

  if (
    popup &&
    !popup.contains(e.target) &&
    (!e.target.getAttribute('data-toggle') ||
      e.target.getAttribute('data-toggle') !== 'modal')
  ) {
    closePopup();
  }
};

const openPopupWorker = function openPopupWorker(sel) {
  let item = document.getElementById(sel);
  let popupContainer = item.parentElement.parentElement;

  let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  body.classList.add('popup-open');
  popupContainer.style.display = 'block';
  popupContainer.classList.add('visible');

  if (!isMobileDevice()) {
    body.style.paddingRight = scrollbarWidth + 'px';
  }

  setTimeout(function () {
    item.classList.add('visible');
    document.addEventListener('click', closePopupByOuterClick);
  }, 10);
};

const openPopup = function openPopup(e, sel) {
  let openedPopup = document.querySelector('.popup.visible');

  if (openedPopup) {
    closePopup();
    setTimeout(function () {
      return openPopupWorker(sel);
    }, 400);
  } else {
    openPopupWorker(sel);
  }
};

const closePopup = function closePopup() {
  let popup = document.querySelector('.popup.visible');
  let popupContainer = popup.parentElement.parentElement;
  popup.classList.remove('visible');

  setTimeout(function () {
    popupContainer.style.display = 'none';
    popupContainer.classList.remove('visible');
    body.style.paddingRight = '0';
    body.classList.remove('popup-open');
  }, 300);
  document.removeEventListener('click', closePopupByOuterClick);
};

let btnsListener = function btnsListener(btns) {
  btns.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      openPopup(e, item.getAttribute('data-target'));
    });
  });
};

if (btns.length) {
  btnsListener(btns);
}

if (closeBtns.length) {
  closeBtns.forEach(function (item) {
    item.addEventListener('click', closePopup);
  });
}

document.addEventListener('keydown', function (event) {
  let key = event.key;
  let popup = document.querySelector('.popup.visible');

  if (popup && key === 'Escape') {
    closePopup();
  }
});
