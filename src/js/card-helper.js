document.addEventListener('DOMContentLoaded', function cardHelper() {
  const cardImages = document.querySelectorAll('.card .card__image img');

  // Empty all card images alt-texts because the images on card listings don't
  // add additional information for the user using screen reader and so only
  // burden the user with useless information. Decision done in 22.1.2025 accessibility meeting.
  function emptyAlt(cardImage) {
    cardImage.alt = '';
  }

  cardImages.forEach(emptyAlt);
});
