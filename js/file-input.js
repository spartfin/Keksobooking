'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  /**
   * Добавление картинки через input[type=file]
   * @param {HTMLElemet} fileChooser - Поле добавления картинки
   * @param {Boolean} isPreview - Создан ли уже элемент превью
   * @param {HTMLElemet} preview - Отображение картинки
   */
  var addPicture = function (fileChooser, isPreview, preview) {
    var file = fileChooser.files[0];

    if (file) {
      var fileName = file.name.toLowerCase();

      /**
      * @description Поиск совпадения расширения файла со списком расширений
      */
      var matches = FILE_TYPES.some(function (extension) {
        return fileName.endsWith(extension);
      });

      if (matches) {
        var reader = new FileReader();

        /**
        * @description При окончании загрузки указать результат загрузки в путь файла
        */
        reader.addEventListener('load', function () {
          if (isPreview) {
            preview.src = reader.result;
          } else {
            var newPreview = document.createElement('img');
            newPreview.src = reader.result;
            newPreview.width = 40;
            newPreview.height = 44;
            newPreview.style = 'object-fit: cover;';
            newPreview.alt = 'Превью';
            preview.appendChild(newPreview);
          }
        });

        reader.readAsDataURL(file);
      }
    }
  };

  var removePicture = function (imgContainer) {
    var pictures = imgContainer.querySelectorAll('img');
    for (var i = pictures.length - 1; i >= 0; i--) {
      imgContainer.removeChild(pictures[i]);
    }
  };

  window.fileInput = {
    addPicture: addPicture,
    removePicture: removePicture
  };

})();
