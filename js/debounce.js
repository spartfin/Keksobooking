'use strict';

(function () {

  var DEBOUNCE_INTERVAL = 500; // ms

  /**
   * Устранение "дребезга" при частых запросах
   * @param {Function} cb - Callback
   * @return {Function} Функция устранения дребезга с собственным таймером
   */
  window.debounce = function (cb) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;
      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }
      lastTimeout = setTimeout(function () {
        cb.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

})();
