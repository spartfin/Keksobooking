'use strict';

(function () {

  var ESC_KEYCODE = 27;

  var mainElement = document.querySelector('main');
  var mapElement = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var mapPinsContainer = document.querySelector('.map__pins');
  var pinButton = mapElement.querySelector('.map__pin--main');

  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var successTemplate = document.querySelector('#success').content.querySelector('.success');

  /**
   * Выбор случайного числа в заданном промежутке
   * @param {Number} min - Минимальное допустимое значение (включительно)
   * @param {Number} max - Максимальное допустимое значение (включительно)
   * @return {Number} Случайное целое число
   */
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * Выбор случайного элемента массива
   * @param {Array} array
   * @return {Any} Случайный элемент массива
   */
  var getRandomElement = function (array) {
    var randomIndex = Math.floor(Math.random() * (array.length));
    return array[randomIndex];
  };

  /**
   * Перемешивание массива (на основе алгоритма Фишера-Йетса)
   * @param {Array} array - Массив, который нужно перемешать
   * @return {Array} Перемешенный массив
   */
  var mixArray = function (array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var swap = array[j];
      array[j] = array[i];
      array[i] = swap;
    }

    return array;
  };

  /**
   * Добавляет или убирает атрибут disabled всем элементам коллекции
   * @param {Array} collection - Коллекция элементов
   * @param {Boolean} needDeactivate - Автивируется или деактивируется элемент
   * (True - для деактивации и False - для активации)
   */
  var toggleEnableElements = function (collection, needDeactivate) {
    for (var i = 0; i < collection.length; i++) {
      collection[i].disabled = needDeactivate;
    }
  };

  /**
   * Согласование существительных с числительными
   * @param {Number} number - числительное в виде числа
   * @param {Object} dictionary - словарь с возможными вариантами существительных
   * @return {String} Подходящее существительное
   */
  var connectNounAndNumral = function (number, dictionary) {
    var tens = Math.abs(number) % 100;
    var units = number % 10;
    if (tens > 10 && tens < 20) {
      return dictionary.other;
    }
    if (units > 1 && units < 5) {
      return dictionary.few;
    }
    if (units === 1) {
      return dictionary.one;
    }
    return dictionary.other;
  };

  /**
   * Функция создания уведомления
   * @param {HTMLElement} template - Template, на сонове гторого генерируется ошибка
   * @param {String} noticeMessage - Сообщение уведомления (необязательное значение)
   */
  var onNotice = function (template, noticeMessage) {
    var noticeElement = template.cloneNode(true);
    var noticeMessageArea = noticeElement.querySelector('p');

    var onEscPress = function (evt) {
      if ((evt.keyCode === ESC_KEYCODE) && (mainElement.contains(noticeElement))) {
        window.form.functions.deactivateForm();
        mainElement.removeChild(noticeElement);
      }
      document.removeEventListener('keydown', onEscPress);
    };
    document.addEventListener('keydown', onEscPress);

    noticeElement.addEventListener('click', function (evt) {
      if ((evt.target !== noticeMessageArea) && (mainElement.contains(noticeElement))) {
        window.form.functions.deactivateForm();
        mainElement.removeChild(noticeElement);
        document.removeEventListener('keydown', onEscPress);
      }
    });

    if (template === errorTemplate) {
      var errorMessage = noticeElement.querySelector('.error__message');
      var errorButton = noticeElement.querySelector('.error__button');

      errorMessage.textContent = noticeMessage;

      errorButton.addEventListener('click', function () {
        window.backend.load(function (data) {
          window.map.activatePage();
          window.map.showOffersPins(data);
          document.removeEventListener('keydown', onEscPress);
        }, window.util.functions.onError);
      });
    }

    if (!mainElement.contains(noticeElement)) {
      mainElement.appendChild(noticeElement);
    }
  };

  /**
   * Создание уведомления об ошибке
   * @param {String} errorMessage - Сообщение ошибки
   */
  var onError = function (errorMessage) {
    onNotice(errorTemplate, errorMessage);
  };

  /**
   * Создание уведомления об успешном выполнении функции
   */
  var onSuccess = function () {
    onNotice(successTemplate);
  };

  window.util = {
    keycode: {
      ESC_KEYCODE: ESC_KEYCODE
    },

    functions: {
      getRandomNumber: getRandomNumber,
      getRandomElement: getRandomElement,
      mixArray: mixArray,
      toggleEnableElements: toggleEnableElements,
      connectNounAndNumral: connectNounAndNumral,
      onError: onError,
      onSuccess: onSuccess
    },

    elems: {
      mapElement: mapElement,
      adForm: adForm,
      mapPinsContainer: mapPinsContainer,
      pinButton: pinButton
    }
  };

})();
