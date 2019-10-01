'use strict';

var COUNT_OBJECTS = 8;
var WIDTH_MAP = 1200;
var MAP_TOP_LIMIT = 130;
var MAP_BOTTOM_LIMIT = 630;
var WIDTH_MARK = 50;
var HEIGHT_MARK = 70;

// Открытие карты
var openMap = function () {
  document.querySelector('.map').classList.remove('map--faded');
};

// Получение случайного элемента массива
var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// Получение случайного числа
var getRandomNumber = function (number) {
  return Math.floor(Math.random() * (number + 1));
};

// Получение случайного числа из диапазона
var getRandomNumberInRange = function (min, max) {
  if (min === 0) {
    return getRandomNumber(max);
  }
  return Math.floor(min + Math.random() * (max + 1 - min));
};

// Перемешивание элементов в массиве
var shuffleArray = function (array) {
  var tempArray = array.slice();

  for (var i = tempArray.length - 1; i >= 0; i--) {
    var j = getRandomNumber(i);
    var temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }

  return tempArray;
};

// Получение массива случайной длины
var getArrayWithRandomLengthAndElements = function (array) {
  return shuffleArray(array).slice(0, getRandomNumberInRange(1, array.length));
};

// Создание объектов
var generateOffer = function (count) {

  var features = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var photos = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
  ];
  var types = ['palace', 'flat', 'house', 'bungalo'];
  var timesCheckIn = ['12:00', '13:00', '14:00'];
  var timesCheckOut = ['12:00', '13:00', '14:00'];

  var offersProperties = [];

  for (var i = 1; i <= count; i++) {
    var locationX = getRandomNumberInRange(0 + (WIDTH_MARK / 2), WIDTH_MAP - (WIDTH_MARK / 2));
    var locationY = getRandomNumberInRange(MAP_TOP_LIMIT, MAP_BOTTOM_LIMIT);

    offersProperties.push({
      'author': {
        'avatar': 'img/avatars/user0' + i + '.png'
      },

      'offer': {
        'title': 'Заголовок объявления',
        'address': locationX + ', ' + locationY,
        'price': 200,
        'type': getRandomElement(types),
        'rooms': 3,
        'guests': 6,
        'checkin': getRandomElement(timesCheckIn),
        'checkout': getRandomElement(timesCheckOut),
        'features': getArrayWithRandomLengthAndElements(features),
        'description': 'Описание',
        'photos': getArrayWithRandomLengthAndElements(photos)
      },

      'location': {
        'x': locationX,
        'y': locationY
      }
    });
  }

  return offersProperties;
};

var getElementFromTemplate = function () {
  return document.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);
};

var renderPins = function (array) {
  var fragment = document.createDocumentFragment();
  var container = document.querySelector('.map__pins');

  array.forEach(function (item) {
    var newElement = getElementFromTemplate();
    newElement.style.left = (item.location.x - WIDTH_MARK / 2) + 'px';
    newElement.style.top = (item.location.y - HEIGHT_MARK) + 'px';
    newElement.firstElementChild.src = item.author.avatar;
    newElement.firstElementChild.alt = item.offer.title;
    fragment.appendChild(newElement);
  });

  container.appendChild(fragment);
};

var offers = generateOffer(COUNT_OBJECTS);
openMap();
renderPins(offers);
