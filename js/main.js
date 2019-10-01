'use strict';

var APARTMENT_OPTIONS = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_OPTIONS = ['12.00', '13.00', '14.00'];
var CHECKOUT_OPTIONS = ['12.00', '13.00', '14.00'];
var FEATURES_OPTIONS = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_OPTIONS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var ADVERT_NUM = 8;
var FEATURE_MARKUP = '<li class="popup__feature popup__feature--$feature"></li>';
var PHOTO_MARKUP = '<img src="$url" class="popup__photo" width="45" height="40" alt="Фотография жилья">';

// Размер метки на карте
var PinSize = {
  WIDTH: 50,
  HEIGHT: 70,
  RADIUS: 25
};

// Размер карты
var MapRect = {
  LEFT: 0,
  TOP: 130,
  RIGHT: 980,
  BOTTOM: 630
};

// Соответствие русских названий типов жилья английским
var offerTypeEnToRu = {
  bungalo: 'Бунгало',
  flat: 'Квартира',
  house: 'Дом',
  palace: 'Дворец'
};

var map = document.querySelector('.map');
var pinContainer = map.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

// Возвращает случайный элемент массива
var getRandomArrayElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// Возвращает случайное число
var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

// Возвращает новый массив случайной длины из существующего
var getRandomElements = function (array) {
  return array.slice(0, getRandomNumber(0, array.length + 1));
};

// Возвращает набор id определенной длины
var getPinIds = function (num) {
  return new Array(num).fill(null).map(function (_, index) {
    index += 1;
    return index < 10 ? '0' + index : String(index);
  });
};

// Создает объявление на основ случайных данных
var createAdvert = function (id) {
  var location = {
    x: getRandomNumber(MapRect.LEFT, MapRect.RIGHT),
    y: getRandomNumber(MapRect.TOP, MapRect.BOTTOM)
  };

  return {
    author: {
      avatar: 'img/avatars/user' + id + '.png'
    },

    offer: {
      title: 'Заголовок Вашего объявления',
      address: location.x + ', ' + location.y,
      price: getRandomNumber(1000, 10000),
      type: getRandomArrayElement(APARTMENT_OPTIONS),
      rooms: getRandomNumber(1, 10),
      guests: getRandomNumber(1, 50),
      checkin: getRandomArrayElement(CHECKIN_OPTIONS),
      checkout: getRandomArrayElement(CHECKOUT_OPTIONS),
      features: getRandomElements(FEATURES_OPTIONS),
      description: 'Здесь может быть Ваше описание',
      photos: getRandomElements(PHOTOS_OPTIONS)
    },

    location: {
      x: location.x,
      y: location.y
    }
  };
};

// Создает массив объявлений
var createAdverts = function (num) {
  return getPinIds(num).map(createAdvert);
};

// Отображает DOM элемент объявления на основе объекта
var renderPin = function (advert) {
  var pin = pinTemplate.cloneNode(true);
  var pinImage = pin.querySelector('img');

  pin.style.left = (advert.location.x - PinSize.RADIUS) + 'px';
  pin.style.top = (advert.location.y - PinSize.HEIGHT) + 'px';
  pinImage.src = advert.author.avatar;
  pinImage.alt = advert.offer.title;

  return pin;
};

// Заполняет блок DOM элементами на основе объектов
var renderPins = function (adverts) {
  var fragment = document.createDocumentFragment();

  adverts.forEach(function (advert) {
    fragment.appendChild(renderPin(advert));
  });

  return pinContainer.appendChild(fragment);
};

// Форматирует строку с временем заезда и выезда
var formatOfferTime = function (offer) {
  return 'Заезд после ' + offer.checkin + ', выезд до ' + offer.checkout;
};

// Форматирует строку с количеством комнат и гостей
var formatOfferCapacity = function (offer) {
  return offer.rooms + ' комнаты для ' + offer.guests + ' гостей';
};

// Форматирует строку с ценой за ночь
var formatOfferPrice = function (offer) {
  return offer.price + ' \u20bd/ночь.';
};

// Возвращает название типа жилья на русском языке
var getOfferType = function (offer) {
  return offerTypeEnToRu[offer.type];
};

// Формирует строку с разметкой для блока преимуществ
var getFeatureMarkup = function (feature) {
  return FEATURE_MARKUP.replace('$feature', feature);
};

// Формирует строку с разметкой для блока фотографий
var getPhotoMarkup = function (url) {
  return PHOTO_MARKUP.replace('$url', url);
};

// Генерирует функции для генерации шаблонных элементов
var makeTemplateGenerator = function (generator) {
  return function getTemplate(values) {
    return values.map(generator).join(' ');
  };
};

var getFeatureTemplate = makeTemplateGenerator(getFeatureMarkup);
var getPhotoTemplate = makeTemplateGenerator(getPhotoMarkup);

// Отображает карточку объявления
var renderCard = function (advert) {
  var offer = advert.offer;
  var card = cardTemplate.cloneNode(true);

  card.querySelector('.popup__avatar').src = advert.author.avatar;

  card.querySelector('.popup__title').textContent = offer.title;
  card.querySelector('.popup__text--address').textContent = offer.address;
  card.querySelector('.popup__description').textContent = offer.description;
  card.querySelector('.popup__text--price').textContent = formatOfferPrice(offer);
  card.querySelector('.popup__text--capacity').textContent = offer.rooms > 0 ? formatOfferCapacity(offer) : '';
  card.querySelector('.popup__text--time').textContent = formatOfferTime(offer);
  card.querySelector('.popup__type').textContent = getOfferType(offer);

  card.querySelector('.popup__features').innerHTML = offer.features.length > 0 ? getFeatureTemplate(offer.features) : '';
  card.querySelector('.popup__photos').innerHTML = offer.photos.length > 0 ? getPhotoTemplate(offer.photos) : '';


  return pinContainer.after(card);
};

var adverts = createAdverts(ADVERT_NUM);

renderCard(adverts[0]);
renderPins(adverts);
