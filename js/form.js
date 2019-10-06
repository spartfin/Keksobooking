'use strict';

(function () {
  var adFormTitleInput = window.util.elems.adForm.querySelector('#title');
  var adFormAdressInput = window.util.elems.adForm.querySelector('#address');
  var adFormAccommodationInput = window.util.elems.adForm.querySelector('#type');
  var adFormPriceInput = window.util.elems.adForm.querySelector('#price');
  var adFormTimeinInput = window.util.elems.adForm.querySelector('#timein');
  var adFormTimeoutInput = window.util.elems.adForm.querySelector('#timeout');
  var adFormRoomsInput = window.util.elems.adForm.querySelector('#room_number');
  var adFormCapacityInput = window.util.elems.adForm.querySelector('#capacity');
  var adFormCapacityOptions = adFormCapacityInput.querySelectorAll('option');
  var adFormAccommodationSelected = adFormAccommodationInput.querySelector('option[selected]');
  var adFormReset = window.util.elems.adForm.querySelector('.ad-form__reset');

  /**
   * Передача координат острого конца метки в поле адреса (форма создания объявления)
   * @param {Boolean} isStartingPosition - Находится ли объект на стратовой позиции (true/false)
   */
  var setPinCoordinates = function (isStartingPosition) {
    var pinX = window.util.elems.pinButton.style.left.slice(0, -2);
    var pinY = window.util.elems.pinButton.style.top.slice(0, -2);
    pinX = Math.round(+pinX + window.data.const.ADJUSTMENT_MAIN_X);

    if (isStartingPosition) {
      pinY = Math.round(+pinY + (window.data.const.PIN_HEIGTH / 2));
    } else {
      pinY = Math.round(+pinY + window.data.const.ADJUSTMENT_MAIN_Y);
    }

    var pinCoordinates = pinX + ', ' + pinY;

    adFormAdressInput.value = pinCoordinates;
  };

  /**
   * Проверка соответствия количества мест количеству комнату
   */
  var checkRoomsAndCapacityValidity = function () {
    if (adFormRoomsInput.value === '100' && adFormCapacityInput.value !== '0') {
      adFormRoomsInput.setCustomValidity('Только не для гостей');
    } else if (adFormCapacityInput.value === '0' && adFormRoomsInput.value !== '100') {
      adFormCapacityInput.setCustomValidity('Для выбора данной опции необходимо 100 комнат');
    } else if (adFormRoomsInput.value < adFormCapacityInput.value && adFormCapacityInput.value !== '0') {
      adFormRoomsInput.setCustomValidity('Количество людей больше, чем мест. Выберете большее количество комнат');
      adFormCapacityInput.setCustomValidity('Количество людей больше, чем мест. Выберете большее количество комнат');
    } else {
      adFormRoomsInput.setCustomValidity('');
      adFormCapacityInput.setCustomValidity('');
    }
  };

  /**
   * Проверка соответствия заголовка требованиям
   */
  var checkTitleValidity = function () {
    if (adFormTitleInput.validity.tooShort) {
      adFormTitleInput.setCustomValidity('Заголовок объявления должен состоять минимум из 30 символов');
    } else if (adFormTitleInput.validity.tooLong) {
      adFormTitleInput.setCustomValidity('Заголовок объявления не должен превышать 100 символов');
    } else if (adFormTitleInput.validity.valueMissing) {
      adFormTitleInput.setCustomValidity('Пожалуйста, введите заголовок');
    } else {
      adFormTitleInput.setCustomValidity('');
    }
  };

  /**
   * Проверка соответствия заголовка требованиям
   */
  var checkPriceValidity = function () {
    if (adFormPriceInput.validity.rangeUnderflow) {
      adFormPriceInput.setCustomValidity('Цена за ночь аренды не должна быть меньше ' + adFormPriceInput.min + '. Увеличьте значение');
    } else if (adFormPriceInput.validity.rangeOverflow) {
      adFormPriceInput.setCustomValidity('Цена за ночь аренды не должна превышать 1 000 000. Уменьшите значение');
    } else if (adFormPriceInput.validity.valueMissing) {
      adFormPriceInput.setCustomValidity('Пожалуйста, введите цену за ночь аренды');
    } else if (adFormPriceInput.validity.typeMismatch) {
      adFormPriceInput.setCustomValidity('Цена может состоять только из цифр. Введите число');
    } else {
      adFormPriceInput.setCustomValidity('');
    }
  };

  /**
   * @description Отключение неподходящих вариантов для данного количества комнат
   * (при выборе количества комнат в форме создания объявления)
   */
  var setOptionsForRooms = function () {
    [].forEach.call(adFormCapacityOptions, function (option) {
      option.disabled = option.value > adFormRoomsInput.value || adFormRoomsInput.value !== '100' && option.value === '0'
      || adFormRoomsInput.value === '100' && option.value !== '0';
    });
  };

  /**
   * @description Изменение минимального значение поля «Цена за ночь»
   * в зависимости от значения «Тип жилья»
   */
  var setPriceMinValue = function () {
    adFormPriceInput.min = window.data.maps.ACCOMMODATION_TYPE_TO_PRICE_MAP[adFormAccommodationInput.value];
    adFormPriceInput.placeholder = window.data.maps.ACCOMMODATION_TYPE_TO_PRICE_MAP[adFormAccommodationInput.value];
  };

  /**
   * @description Очистить поля ввода у формы и установить изначальные значения min и placehplder поля цены
   */
  var resetForm = function () {
    window.util.elems.adForm.reset();
    setPriceMinValue();
  };

  /**
   * @description Неактивное состояние при отправке или сбросе формы
   */
  var deactivateForm = function () {
    window.map.deactivatePage();
    resetForm();
    setOptionsForRooms();
    window.pin.removeOffer();
    window.card.closeCard();
    window.pin.setPinStartPosition();
    setPinCoordinates(true);
    window.util.elems.mapElement.classList.add('map--faded');
  };

  /**
   * @description При выборе количества комнат в форме создания объявления включается
   * проверка соответствия количества мест количеству комнату и отключаются лишние опции при выборе количества мест
   */
  adFormRoomsInput.addEventListener('change', function () {
    checkRoomsAndCapacityValidity();
    setOptionsForRooms();
  });

  /**
   * @description При выборе количества мест в форме создания объявления включается
   * проверка соответствия количества мест количеству комнату и отключаются лишние опции при выборе количества мест
   */
  adFormCapacityInput.addEventListener('change', function () {
    checkRoomsAndCapacityValidity();
  });

  /**
   * @description При выборе заголовка в форме создания объявления включается
   * проверка соответствия на заполнение формы и длину названия
   */
  adFormTitleInput.addEventListener('input', function () {
    checkTitleValidity();
  });

  /**
   * @description При выборе количества мест в форме создания объявления включается
   * проверка соответствия количества мест количеству комнату
   */
  adFormPriceInput.addEventListener('change', function () {
    checkPriceValidity();
    setPriceMinValue();
  });

  /**
   * @description При выборе количества мест в форме создания объявления включается
   * проверка соответствия количества мест количеству комнату
   */
  adFormAccommodationInput.addEventListener('change', function () {
    setPriceMinValue();
  });

  /**
   * @description При выборе времени отъезда оно синхронезируется со времени заезда
   */
  adFormTimeoutInput.addEventListener('change', function () {
    adFormTimeinInput.value = adFormTimeoutInput.value;
  });

  /**
   * @description При выборе времени заезда оно синхронезируется со времени отъезда
   */
  adFormTimeinInput.addEventListener('change', function () {
    adFormTimeoutInput.value = adFormTimeinInput.value;
  });

  /**
   * @description Обработчик события при сбросе значений формы
   */
  adFormReset.addEventListener('click', function (evt) {
    evt.preventDefault();
    deactivateForm();
    adFormPriceInput.min = window.data.maps.ACCOMMODATION_TYPE_TO_PRICE_MAP[adFormAccommodationSelected.value];
    adFormPriceInput.placeholder = window.data.maps.ACCOMMODATION_TYPE_TO_PRICE_MAP[adFormAccommodationSelected.value];
  });

  /**
   * @description Обработчик события отправки данных формы формы
   */
  window.util.elems.adForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(window.util.elems.adForm), function () {
      deactivateForm();
      window.util.functions.onSuccess();
    }, window.util.functions.onError);
  });

  window.form = {
    functions: {
      setPinCoordinates: setPinCoordinates,
      setOptionsForRooms: setOptionsForRooms,
      setPriceMinValue: setPriceMinValue,
      deactivateForm: deactivateForm
    }
  };

})();
