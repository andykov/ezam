"use strict";

// Set body auto padding
document.addEventListener('DOMContentLoaded', setBodyPadding);

function setBodyPadding() {
  var h = document.querySelector('header');
  document.querySelector('body').style.paddingTop = h.clientHeight + 'px';
} // Popup


var btns = document.querySelectorAll('[data-toggle="modal"');
var body = document.querySelector('body');
var closeBtns = document.querySelectorAll('.popup-close-btn');

var isMobileDevice = function isMobileDevice() {
  return typeof window.orientation !== 'undefined' || navigator.userAgent.indexOf('IEMobile') !== -1;
};

var closePopupByOuterClick = function closePopupByOuterClick(e) {
  var popup = document.querySelector('.popup.visible');

  if (popup && !popup.contains(e.target) && (!e.target.getAttribute('data-toggle') || e.target.getAttribute('data-toggle') !== 'modal')) {
    closePopup();
  }
};

var openPopupWorker = function openPopupWorker(sel) {
  var item = document.getElementById(sel);
  var popupContainer = item.parentElement.parentElement;
  var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
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

var openPopup = function openPopup(e, sel) {
  var openedPopup = document.querySelector('.popup.visible');

  if (openedPopup) {
    closePopup();
    setTimeout(function () {
      return openPopupWorker(sel);
    }, 400);
  } else {
    openPopupWorker(sel);
  }
};

var closePopup = function closePopup() {
  var popup = document.querySelector('.popup.visible');
  var popupContainer = popup.parentElement.parentElement;
  popup.classList.remove('visible');
  setTimeout(function () {
    popupContainer.style.display = 'none';
    popupContainer.classList.remove('visible');
    body.style.paddingRight = '0';
    body.classList.remove('popup-open');
  }, 300);
  document.removeEventListener('click', closePopupByOuterClick);
};

var btnsListener = function btnsListener(btns) {
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
  var key = event.key;
  var popup = document.querySelector('.popup.visible');

  if (popup && key === 'Escape') {
    closePopup();
  }
});
; // File upload

var fileInputs = document.querySelectorAll('input[type="file"]');

if (fileInputs.length) {
  fileInputs.forEach(function (input) {
    var fileWrap = input.parentElement;

    if (!fileWrap.classList.contains('input-file-wrap')) {
      fileWrap = fileWrap.parentElement;
    }

    input.addEventListener('change', function (e) {
      var that = e.target;
      var files = that.files;
      var filesStr = '';
      Array.from(files).forEach(function (file, index) {
        if (index) {
          filesStr += ', ';
        }

        filesStr += file.name;
      });
      fileWrap.querySelector('[data-toggle="filename"]').innerHTML = filesStr;
      var fileHolder = fileWrap.querySelector('.input-file-wrap__holder');

      if (input.value) {
        fileHolder.classList.add('visible');
        fileWrap.classList.add('selected');
      } else {
        fileHolder.classList.remove('visible');
        fileWrap.classList.remove('selected');
      }
    });
    fileWrap.querySelector('.input-file-wrap__rm-btn').addEventListener('click', function (e) {
      input.value = '';
      var that = e.target;
      that.parentElement.classList.remove('visible');
      fileWrap.classList.remove('selected');
    });
  });
}

; // Form

var inputs = document.querySelectorAll('.input-field input, .input-field textarea');

var inputFocus = function inputFocus(e) {
  var input = e.target;
  var inputControl = input.parentElement;
  inputControl.classList.add('focused');
};

var inputBlur = function inputBlur(e) {
  var input = e.target;
  var inputControl = input.parentElement;
  inputControl.classList.remove('focused');

  if (input.value !== '') {
    inputControl.classList.add('filled');
    inputControl.classList.remove('error');
  } else {
    inputControl.classList.remove('filled');
  }
};

var inputTyping = function inputTyping(e) {
  var input = e.target;
  var inputControl = input.parentElement;
  var errorMsg = inputControl.querySelector('.error-msg');
  inputControl.classList.remove('error');

  if (errorMsg) {
    errorMsg.remove();
  }
};

if (inputs.length) {
  inputs.forEach(function (item) {
    item.addEventListener('focus', inputFocus);
  });
  inputs.forEach(function (item) {
    item.addEventListener('blur', inputBlur);
  });
  inputs.forEach(function (item) {
    item.addEventListener('input', inputTyping);
  });
}

;
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
  var popup = document.querySelector(el);

  if (!popup) {
    console.error(el + ' not found');
    return;
  }

  var popupNavEl = popup.querySelector('.nav');

  if (popupNavEl && remove) {
    popupNavEl.remove();

    if (popup.classList.contains('visible')) {
      closePopup();
      return;
    }
  } else {
    var popupContent = popup.querySelector('.popup__content');
    var nav = document.querySelector('.header .nav');
    var clone = nav.cloneNode(true);
    popupContent.appendChild(clone);
    var dropdown = popup.querySelector('[data-child-nav]');
    dropdown.classList.add('show');
  }
} // Mobile project menu dropdown


var projectsDropdown = document.querySelector('.projects-nav');

if (projectsDropdown) {
  projectsDropdown.addEventListener('click', function (event) {
    projectsDropdown.classList.toggle('show');
  });
}

function mobileProjectNavToggle(show) {
  var current = document.querySelector('.projects-nav_current');

  if (current && show) {
    var active = current.parentElement.querySelector('.active');
    var text = active.textContent;
    current.textContent = active.textContent;
  }
} // Show children nav


var navItems = document.querySelectorAll('[data-child-nav]');

if (navItems.length) {
  navItems.forEach(function (item) {
    item.addEventListener('mouseenter', function (e) {
      e.preventDefault();
      this.classList.add('show');
    });
    item.addEventListener('mouseleave', function (e) {
      e.preventDefault();
      this.classList.remove('show');
    });
  });
}