'use strict';

(function () {
  var mapFiltersForm = document.querySelector('.map__filters');
  var mapFiltersFormSelects = mapFiltersForm.querySelectorAll('select');
  var mapFiltersFormFieldsets = mapFiltersForm.querySelectorAll('fieldset');
  var adFormSelects = window.util.elems.adForm.querySelectorAll('select');
  var adFormFieldsets = window.util.elems.adForm.querySelectorAll('fieldset');

  /**
   * @description Показывает карту
   */
  var activateMap = function () {
    window.util.elems.mapElement.classList.remove('map--faded');
  };

  /**
   * @description Показывает пин объявления на карте
   * @param {Array} data - Данные объявлений
   */
  var showOffersPins = function (data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < data.length; i++) {
      var offer = window.pin.renderOffer(data[i]);
      fragment.appendChild(offer);
    }

    window.util.elems.mapPinsContainer.appendChild(fragment);
  };

  /**
   * @description Отображение пинов объявлений на карте с использование данных с сервера
   */
  var offersPinsLoad = function () {
    window.backend.load(function (data) {
      window.defaultData = data;
      showOffersPins(window.filters.filterAll());
    }, window.util.functions.onError);
  };

  /**
   * @description Неактивное состояние страницы, формы заблокированы
   */
  var deactivatePage = function () {
    window.util.functions.toggleEnableElements(mapFiltersFormSelects, true);
    window.util.functions.toggleEnableElements(mapFiltersFormFieldsets, true);
    window.util.functions.toggleEnableElements(adFormFieldsets, true);
    window.util.functions.toggleEnableElements(adFormSelects, true);
    if (!window.util.elems.adForm.classList.contains('ad-form--disabled')) {
      window.util.elems.adForm.classList.add('ad-form--disabled');
    }
  };

  /**
   * @description Активное состояние страницы, формы разблокированы,
   * на карте отражаются похожие объявления
   */
  var activatePage = function () {
    if (!window.util.elems.mapElement.classList.contains('map--faded')) {
      return;
    }
    window.util.elems.adForm.classList.remove('ad-form--disabled');
    window.util.functions.toggleEnableElements(mapFiltersFormSelects, false);
    window.util.functions.toggleEnableElements(mapFiltersFormFieldsets, false);
    window.util.functions.toggleEnableElements(adFormFieldsets, false);
    window.util.functions.toggleEnableElements(adFormSelects, false);

    window.form.functions.setPinCoordinates(false);
    window.form.functions.setOptionsForRooms();
    window.form.functions.setPriceMinValue();
    activateMap();
    offersPinsLoad();
    document.removeEventListener('DOMContentLoaded', deactivatePage);
  };

  /**
   * @description При загрузке страница находится в неактивном состоянии
   */
  document.addEventListener('DOMContentLoaded', function () {
    deactivatePage();
    window.form.functions.setPinCoordinates(true);
  });

  /**
   * @description При клике на пин страница переводится в активное состояние
   */
  window.util.elems.pinButton.addEventListener('mousedown', function () {
    activatePage();
  });

  /**
   * @description При нажании Enter с фокусом на пине страница переводится в активное состояние
   */
  window.util.elems.pinButton.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.keycode.ENTER_KEYCODE) {
      activatePage();
    }
  });

  window.map = {
    activatePage: activatePage,
    deactivatePage: deactivatePage,
    showOffersPins: showOffersPins
  };

})();
