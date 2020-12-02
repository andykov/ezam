// Istouch device
function isTouchDevice() {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// Set body auto padding
document.addEventListener('DOMContentLoaded', setBodyPadding);

function setBodyPadding() {
  const h = document.querySelector('header');
  document.querySelector('body').style.paddingTop = h.clientHeight + 'px';
}

// Auto Resize textarea
@@include('autoresize.js');

// Popup
@@include('popup.js');

// File upload
@@include('file-upload.js');

// Form
@@include('form.js');

// Tabs
@@include('tabs.js');

var mediaQuery = window.matchMedia('(max-width: 999px)');

function handleTabletChange(e) {
  if (e.matches) {
    movingCloneNav('#popup-nav', false);
    mobileProjectNavToggle(true);
  } else {
    movingCloneNav('#popup-nav', true);
    mobileProjectNavToggle(false);
  }
}

mediaQuery.addListener(handleTabletChange);
handleTabletChange(mediaQuery);

function movingCloneNav(el, remove) {
  let popup = document.querySelector(el);
  if (!popup) {
    console.error(el + ' not found');
    return;
  }

  if (remove) {
    let popupNavEl = popup.querySelector('.nav');
    if (popupNavEl) {
      popupNavEl.remove();
    }
    if (popup.classList.contains('visible')) {
      closePopup();
      return;
    }
  } else {
    let popupContent = popup.querySelector('.popup__content');
    let nav = document.querySelector('.header .nav');

    let clone = nav.cloneNode(true);
    popupContent.appendChild(clone);
    let dropdown = popup.querySelector('[data-child-nav]');
    dropdown.classList.add('show');
  }
}

// Mobile project menu dropdown
let projectsDropdown = document.querySelector('.projects-nav');

if (projectsDropdown) {
  projectsDropdown.addEventListener('click', (event) => {
    projectsDropdown.classList.toggle('show');
  });
}

function mobileProjectNavToggle(show) {
  const current = document.querySelector('.projects-nav_current');

  if (current && show) {
    const active = current.parentElement.querySelector('.active');
    const text = active.textContent;
    current.textContent = active.textContent;
  }
}

// Show children nav
const navItems = document.querySelectorAll('[data-child-nav]');
if (navItems.length) {
  navItems.forEach(function (item) {
    if (isTouchDevice()) {
      item.addEventListener('click', function (e) {
        console.log(1);
        e.preventDefault();
        item.classList.toggle('show');
      });
    } else {
      item.addEventListener('mouseenter', function (e) {
        e.preventDefault();
        item.classList.add('show');
      });
      item.addEventListener('mouseleave', function (e) {
        console.log(4);
        e.preventDefault();
        item.classList.remove('show');
      });
    }
  });
}
