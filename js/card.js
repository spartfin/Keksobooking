'use strict';

(function () {

  var offersPopupTimplate = document.querySelector('#card').content;
  var mapFilters = document.querySelector('.map__filters-container');

  /**
  * Генерация модального окна с информацией об объявлении
  * @param {Object} itemData - Данные объявления, которые передаются в объявление
  */
  var showModalOffer = function (itemData) {
    var popupOfferElement = offersPopupTimplate.cloneNode(true);
    var popupOfferTitle = popupOfferElement.querySelector('.popup__title');
    var popupOfferAddress = popupOfferElement.querySelector('.popup__text--address');
    var popupOfferPrice = popupOfferElement.querySelector('.popup__text--price');
    var popupOfferType = popupOfferElement.querySelector('.popup__type');
    var popupOfferCapacity = popupOfferElement.querySelector('.popup__text--capacity');
    var popupOfferTime = popupOfferElement.querySelector('.popup__text--time');
    var popupOfferFeatures = popupOfferElement.querySelector('.popup__features');
    var popupOfferDescription = popupOfferElement.querySelector('.popup__description');
    var popupOfferPhotos = popupOfferElement.querySelector('.popup__photos');
    var popupOfferPhotosElement = popupOfferPhotos.querySelector('.popup__photo');
    var popupOfferAvatar = popupOfferElement.querySelector('.popup__avatar');

    /**
     * @description Отображение доступных удобств в объявлении для попапа
     */
    var renderFeaturesInPopup = function () {
      popupOfferFeatures.innerHTML = '';
      for (var i = 0; i < itemData.offer.features.length; i++) {
        var createElement = document.createElement('li');
        createElement.classList.add('popup__feature');
        createElement.classList.add('popup__feature--' + itemData.offer.features[i]);
        popupOfferFeatures.appendChild(createElement);
      }
    };

    /**
     * @description Отображение фотографий в объявлении для попапа
     */
    var renderPhotosInPopup = function () {
      for (var j = 0; j < itemData.offer.photos.length; j++) {
        var clonedPhotosElement = popupOfferPhotosElement.cloneNode(true);
        clonedPhotosElement.src = itemData.offer.photos[j];
        popupOfferPhotos.appendChild(clonedPhotosElement);
      }
    };

    popupOfferTitle.textContent = itemData.offer.title;
    popupOfferAddress.textContent = itemData.offer.address;
    popupOfferPrice.textContent = itemData.offer.price + '₽/ночь';
    popupOfferType.textContent = window.data.maps.ACCOMMODATION_TYPES_MAP[itemData.offer.type];
    popupOfferCapacity.textContent = itemData.offer.rooms + ' ' + window.util.functions.connectNounAndNumral(itemData.offer.rooms, window.data.maps.DICTIONARY_ROOMS) +
    ' для ' + itemData.offer.guests + ' ' + window.util.functions.connectNounAndNumral(itemData.offer.guests, window.data.maps.DICTIONARY_GUESTS);
    popupOfferTime.textContent = 'Заезд после ' + itemData.offer.checkin + ', выезд до ' + itemData.offer.checkout;
    renderFeaturesInPopup(itemData);
    popupOfferDescription.textContent = itemData.offer.description;
    popupOfferPhotos.innerHTML = '';
    renderPhotosInPopup(itemData);
    popupOfferAvatar.src = itemData.author.avatar;

    window.util.elems.mapElement.appendChild(popupOfferElement);
    window.util.elems.mapElement.insertBefore(popupOfferElement, mapFilters);
  };

  /**
  * @description Закртыие карточки
  */
  var closeCard = function () {
    var pinPopup = document.querySelector('.map__card');
    if (pinPopup) {
      window.util.elems.mapElement.removeChild(pinPopup);
    }
  };

  /**
   * @description Зыкрытие попапа с информацией об объявлении при нажатии ECS
   */
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.util.keycode.ESC_KEYCODE) {
      closeCard();
    }
  });

  /**
   * @description Зыкрытие попапа с информацией об объявлении при клике на крестик (при помощи делегирования)
   */
  document.addEventListener('click', function (evt) {
    if (evt.target.matches('.popup__close')) {
      closeCard();
    }
  });

  window.card = {
    showModalOffer: showModalOffer,
    closeCard: closeCard
  };

})();
