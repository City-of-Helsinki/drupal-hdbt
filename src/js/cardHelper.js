((Drupal) => {
  Drupal.behaviors.cardHelper = {
    attach (context) {
      const cardImages = once('cardHelper', '.card .card__image img', context);

      // Empty all card images alt-texts because the images on card listings don't
      // add additional information for the user using screen reader and so only
      // burden the user with useless information. Decision done in 22.1.2025 accessibility meeting.
      cardImages.forEach((cardImage) => {
        cardImage.alt = '';
      });
    }
  };
})(Drupal);
