const inputs = document.querySelectorAll(
  '.input-field input, .input-field textarea'
);

const inputFocus = function inputFocus(e) {
  var input = e.target;
  var inputControl = input.parentElement;
  inputControl.classList.add('focused');
};

const inputBlur = function inputBlur(e) {
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

const inputTyping = function inputTyping(e) {
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
