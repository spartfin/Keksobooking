'use strict';

(function () {
  var mapFilter = document.querySelector('.map__filters');
  var housingType = mapFilter.querySelector('#housing-type');
  var housingPrice = mapFilter.querySelector('#housing-price');
  var housingRooms = mapFilter.querySelector('#housing-rooms');
  var housingGuests = mapFilter.querySelector('#housing-guests');
  var housingFeatures = mapFilter.querySelector('#housing-features');
  var housingWiFi = housingFeatures.querySelector('#filter-wifi');
  var housingDishwasher = housingFeatures.querySelector('#filter-dishwasher');
  var housingParking = housingFeatures.querySelector('#filter-parking');
  var housingWasher = housingFeatures.querySelector('#filter-washer');
  var housingElevator = housingFeatures.querySelector('#filter-elevator');
  var housingConditioner = housingFeatures.querySelector('#filter-conditioner');
  var PINS_COUNT = 5;

  /**
  * @description Проверка для каждого элемента массива на основе значения фильтра типа жилья
  * @param {Object} item - Элемент массива (объект) для которого выполняется проверка
  * @return {Boolean} - Подходит ли типа жилья под фильтр
  */
  var getHousingType = function (item) {
    if (housingType.value === 'any') {
      return true;
    } else {
      return item.offer.type === housingType.value;
    }
  };

  /**
  * @description Проверка для каждого элемента массива на основе значения фильтра цены
  * @param {Object} item - Элемент массива (объект) для которого выполняется проверка
  * @return {Boolean} - Подходит ли цена под фильтр
  */
  var getHousingPrice = function (item) {
    if (housingPrice.value === 'any') {
      return true;
    } else {
      return (
        ((housingPrice.value === 'low') && (item.offer.price < 10000)) ||
        ((housingPrice.value === 'high') && (item.offer.price > 50000)) ||
        ((housingPrice.value === 'middle') && (item.offer.price >= 10000) && (item.offer.price <= 50000))
      );
    }
  };

  /**
  * @description Проверка для каждого элемента массива на основе значения фильтра количества комнат
  * @param {Object} item - Элемент массива (объект) для которого выполняется проверка
  * @return {Boolean} - Подходит ли количество комнат под фильтр
  */
  var getHousingRooms = function (item) {
    if (housingRooms.value === 'any') {
      return true;
    } else {
      return item.offer.rooms === parseInt(housingRooms.value, 10);
    }
  };

  /**
  * @description Проверка для каждого элемента массива на основе значения фильтра количества гостей
  * @param {Object} item - Элемент массива (объект) для которого выполняется проверка
  * @return {Boolean} - Подходит ли количество гостей под фильтр
  */
  var getHousingGuests = function (item) {
    if (housingGuests.value === 'any') {
      return true;
    } else {
      return (
        ((parseInt(housingGuests.value, 10) !== 0) && (item.offer.guests >= parseInt(housingGuests.value, 10))) ||
        ((parseInt(housingGuests.value, 10) === 0) && (item.offer.guests === 0))
      );
    }
  };

  /**
  * @description Проверка для каждого элемента массива на основе значения одного из фильров удобств
  * @param {Object} item - Элемент массива (объект) для которого выполняется проверка
  * @param {HTMLElement} feature - Фильтр для, которого выполняется проверка
  * @return {Boolean} - Подходит ли удобства под фильтр
  */
  var getHousingFeatures = function (item, feature) {
    if (feature.checked === false) {
      return true;
    } else {
      return (item.offer.features.indexOf(feature.value) !== -1);
    }
  };

  /**
  * @description На основе изначального массива данных создает новый
  * подходящий под условия фильтров и имеющий нужную длину
  * @return {Array} - Новый массив
  */
  var filterAll = function () {
    return window.defaultData
    .filter(function (item) {
      return (
        getHousingType(item) &&
        getHousingRooms(item) &&
        getHousingGuests(item) &&
        getHousingPrice(item) &&
        getHousingFeatures(item, housingWiFi) &&
        getHousingFeatures(item, housingDishwasher) &&
        getHousingFeatures(item, housingParking) &&
        getHousingFeatures(item, housingWasher) &&
        getHousingFeatures(item, housingElevator) &&
        getHousingFeatures(item, housingConditioner)
      );
    })
    .slice(0, PINS_COUNT);
  };

  /**
  * @description Обработчик, закрывает объявления, убирает пины и создает новые на основе требований фильтра
  */
  var onHousingFilter = window.debounce(function () {
    window.card.closeCard();
    window.pin.removeOffer();
    window.map.showOffersPins(filterAll());
  });

  var resetFilters = function () {
    mapFilter.reset();
  };

  /**
  * @description Событие изменения значения фильтра типа жилья
  */
  mapFilter.addEventListener('change', onHousingFilter);

  window.filters = {
    filterAll: filterAll,
    resetFilters: resetFilters
  };

})();
