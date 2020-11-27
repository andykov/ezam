const fileInputs = document.querySelectorAll('input[type="file"]');

if (fileInputs.length) {
  fileInputs.forEach(function (input) {
    let fileWrap = input.parentElement;

    if (!fileWrap.classList.contains('input-file-wrap')) {
      fileWrap = fileWrap.parentElement;
    }

    input.addEventListener('change', function (e) {
      let that = e.target;
      let files = that.files;
      let filesStr = '';
      Array.from(files).forEach(function (file, index) {
        if (index) {
          filesStr += ', ';
        }

        filesStr += file.name;
      });
      fileWrap.querySelector('[data-toggle="filename"]').innerHTML = filesStr;
      let fileHolder = fileWrap.querySelector('.input-file-wrap__holder');

      if (input.value) {
        fileHolder.classList.add('visible');
        fileWrap.classList.add('selected');
      } else {
        fileHolder.classList.remove('visible');
        fileWrap.classList.remove('selected');
      }
    });
    fileWrap
      .querySelector('.input-file-wrap__rm-btn')
      .addEventListener('click', function (e) {
        input.value = '';
        let that = e.target;
        that.parentElement.classList.remove('visible');
        fileWrap.classList.remove('selected');
      });
  });
}
