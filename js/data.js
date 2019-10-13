'use strict';

(function () {

  var ACCOMMODATION_TYPES_MAP = {
    'any': 'Любой тип жилья',
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };
  var START_COORDINATES = {
    x: 570,
    y: 375
  };
  var MIN_X = 0;
  var MAX_X = 1200;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var PIN_WIDTH = 65;
  var PIN_HEIGTH = 65;
  var PIN_TAIL_HEIGHT = 16;
  var ADJUSTMENT_MAIN_X = PIN_WIDTH / 2;
  var ADJUSTMENT_MAIN_Y = PIN_HEIGTH + PIN_TAIL_HEIGHT;
  var DICTIONARY_ROOMS = {
    'one': 'комната',
    'few': 'комнаты',
    'other': 'комнат'};
  var DICTIONARY_GUESTS = {
    'one': 'гостя',
    'few': 'гостей',
    'other': 'гостей'};
  var ACCOMMODATION_TYPE_TO_PRICE_MAP = {
    'bungalo': 0,
    'flat': 1000,
    'house': 5000,
    'palace': 10000
  };

  window.data = {
    maps: {
      ACCOMMODATION_TYPES_MAP: ACCOMMODATION_TYPES_MAP,
      DICTIONARY_ROOMS: DICTIONARY_ROOMS,
      DICTIONARY_GUESTS: DICTIONARY_GUESTS,
      ACCOMMODATION_TYPE_TO_PRICE_MAP: ACCOMMODATION_TYPE_TO_PRICE_MAP
    },

    const: {
      START_COORDINATES: START_COORDINATES,
      PIN_HEIGTH: PIN_HEIGTH,
      ADJUSTMENT_MAIN_X: ADJUSTMENT_MAIN_X,
      ADJUSTMENT_MAIN_Y: ADJUSTMENT_MAIN_Y,
      MIN_X: MIN_X,
      MAX_X: MAX_X,
      MIN_Y: MIN_Y,
      MAX_Y: MAX_Y
    }
  };

})();
