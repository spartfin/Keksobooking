'use strict';

(function () {
  var offersTimplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var Coordinates = function (x, y) {
    this.x = x;
    this.y = y;
  };

  /**
  * Генерация пина похожeго объявления
  * @param {Object} itemData - Данные объявления, которые передаются в пин
  * @return {HTMLElemet} Шаблон для генерации пина похожeго объявления
  */
  var renderOffer = function (itemData) {
    var pinElement = offersTimplate.cloneNode(true);
    var pinElementImg = pinElement.querySelector('img');

    pinElement.style.left = itemData.location.x + 'px';
    pinElement.style.top = itemData.location.y + 'px';
    pinElementImg.src = itemData.author.avatar;
    pinElementImg.alt = itemData.offer.description;
    pinElement.setAttribute('data-params', JSON.stringify(itemData));

    return pinElement;
  };

  /**
  * @description Установка главного пина на старотвую позицию
  */
  var setPinStartPosition = function () {
    window.util.elems.pinButton.style.left = window.data.const.START_COORDINATES.x + 'px';
    window.util.elems.pinButton.style.top = window.data.const.START_COORDINATES.y + 'px';
  };

  /**
  * @description Удаление пинов похожих объявлений
  */
  var removeOffer = function () {
    var offers = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    for (var i = offers.length - 1; i >= 0; i--) {
      window.util.elems.mapPinsContainer.removeChild(offers[i]);
    }
  };

  /**
   * @description При нажатии и удержании появляется возможность перемещать пин, если страница уже активна
   */
  window.util.elems.pinButton.addEventListener('mousedown', function (evt) {
    var startCoordinates = new Coordinates(evt.clientX, evt.clientY);

    var onMouseMove = function (moveEvt) {
      var MAP_MIN_X = window.data.const.MIN_X - window.data.const.ADJUSTMENT_MAIN_X;
      var MAP_MAX_X = window.data.const.MAX_X - window.data.const.ADJUSTMENT_MAIN_X;
      var MAP_MIN_Y = window.data.const.MIN_Y - window.data.const.ADJUSTMENT_MAIN_Y;
      var MAP_MAX_Y = window.data.const.MAX_Y - window.data.const.ADJUSTMENT_MAIN_Y;

      var shift = new Coordinates(startCoordinates.x - moveEvt.clientX, startCoordinates.y - moveEvt.clientY);

      startCoordinates = new Coordinates(moveEvt.clientX, moveEvt.clientY);

      var offsetCoords = new Coordinates(
          window.util.elems.pinButton.offsetLeft - shift.x,
          window.util.elems.pinButton.offsetTop - shift.y
      );

      if (offsetCoords.x < MAP_MIN_X) {
        offsetCoords.x = MAP_MIN_X;
      } else if (offsetCoords.x > MAP_MAX_X) {
        offsetCoords.x = MAP_MAX_X;
      } else if (offsetCoords.y < MAP_MIN_Y) {
        offsetCoords.y = MAP_MIN_Y;
      } else if (offsetCoords.y > MAP_MAX_Y) {
        offsetCoords.y = MAP_MAX_Y;
      }

      window.util.elems.pinButton.style.top = offsetCoords.y + 'px';
      window.util.elems.pinButton.style.left = offsetCoords.x + 'px';

      window.form.functions.setPinCoordinates(false);
    };

    var onMouseUp = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  window.pin = {
    renderOffer: renderOffer,
    removeOffer: removeOffer,
    setPinStartPosition: setPinStartPosition
  };

})();
