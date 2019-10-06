'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var DATA_URL = URL + '/data';
  var STATUS_SUCCESS = 200;

  /**
   * Обращение к серверу и обработка возможных ошибок
   * @param {Function} onLoad - Вызов функции при успешном обращении к серверу
   * @param {Function} onError - Вызов функции при ошибке
   * @return {Object} - XMLHttpRequest-объект
   */
  var initXHR = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === STATUS_SUCCESS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Прeвышено время ожидания ответа от сайта. Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 15000;

    return xhr;
  };

  /**
   * Загрузка данных с сервера
   * @param {Function} onLoad - Вызов функции при успешном обращении к серверу
   * @param {Function} onError - Вызов функции при ошибке
   */
  var load = function (onLoad, onError) {
    var xhr = initXHR(onLoad, onError);
    xhr.open('GET', DATA_URL);
    xhr.send();
  };

  /**
   * Передача данных серверу
   * @param {Object} data - Данные, которые передаются серверу
   * @param {Function} onLoad - Вызов функции при успешном обращении к серверу
   * @param {Function} onError - Вызов функции при ошибке
   */
  var save = function (data, onLoad, onError) {
    var xhr = initXHR(onLoad, onError);
    xhr.open('POST', URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };

})();
