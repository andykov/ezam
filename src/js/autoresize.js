document.querySelectorAll('textarea').forEach(function (element) {
  element.style.boxSizing = 'border-box';
  let offset = element.offsetHeight - element.clientHeight;
  element.addEventListener('input', function (event) {
    event.target.style.height = 'auto';
    event.target.style.height = event.target.scrollHeight + offset + 'px';
  });
  element.removeAttribute('textarea');
});
