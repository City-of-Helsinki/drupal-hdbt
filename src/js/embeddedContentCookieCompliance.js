/**
 * @file
 * Load embedded content once the user has approved required cookie category.
 */
(($, Drupal, drupalSettings) => {
  // Check whether the given cookie categories have been accepted.
  const categoriesAgreed = (categories) => {
    // Set default categories if none exists.
    if (!categories) {
      categories = ['preferences', 'statistics'];
    }
    // If the 'bypass' category is included, the content should be loaded.
    if (categories.includes('bypass')) {
      return true;
    }
    return Drupal.cookieConsent.getConsentStatus(categories);
  };

  const loadEmbeddedContent = () => {
    Object.entries(drupalSettings?.embedded_media_attributes || {}).forEach(
      ([id, attributes]) => {
        if (!categoriesAgreed(attributes?.cookieConsentGroups)) {
          return;
        }

        const mediaContainers = $(
          `.embedded-content-cookie-compliance.media-${id}`,
        );

        // Each of the media type is grouped to their own
        // mediaContainers so we need to iterate through them.
        mediaContainers.each(function processMediaContainer(index) {
          const mediaContainer = $(this);

          const iframeElement = document.createElement('iframe');
          iframeElement.classList.add('media-oembed-content');
          iframeElement.src = attributes.src;
          iframeElement.title = attributes.title;

          if (attributes.allow) {
            iframeElement.allow = attributes.allow;
          }

          if (attributes.height) {
            iframeElement.height = attributes.height;
          }
          if (attributes.width) {
            iframeElement.width = attributes.width;
          }

          const containerElement = document.createElement('div');
          containerElement.appendChild(iframeElement);

          // Extract the media name from the wrapping component title or in
          // case of video, from the remote video - video title.
          // Fallback to empty if no title is set.
          let mediaName = '';
          switch (attributes.type) {
            case 'video':
              mediaName =
                mediaContainer
                  .parent()
                  .siblings('.remote-video__video-title')
                  .text()
                  .trim() || '';
              break;
            default:
              mediaName =
                mediaContainer
                  .closest(`.component__content.${attributes.type}`)
                  .siblings('.component__title')
                  .text()
                  .trim() || '';
              break;
          }

          // Initialize skip links elements.
          const skipLinkBefore = document.createElement('a');
          const skipLinkAfter = document.createElement('a');

          // Construct skip links if their IDs are set.
          if (attributes.skipLinkBeforeId && attributes.skipLinkAfterId) {
            skipLinkBefore.classList.add('focusable', 'skip-link');
            skipLinkBefore.href = `#${attributes.skipLinkAfterId}-${index}`;
            skipLinkBefore.id = `${attributes.skipLinkBeforeId}-${index}`;

            skipLinkAfter.classList.add('focusable', 'skip-link');
            skipLinkAfter.href = `#${attributes.skipLinkBeforeId}-${index}`;
            skipLinkAfter.id = `${attributes.skipLinkAfterId}-${index}`;
          }

          switch (attributes.type) {
            case 'video':
              containerElement.classList.add(
                `responsive-${attributes.type}-container`,
              );
              skipLinkAfter.classList.add('skip-link--video--after');
              skipLinkBefore.classList.add('skip-link--video--before');

              // Adjust the skip link text based on whether the mediaName is found.
              skipLinkAfter.text = Drupal.t(
                'Continue above the @video video',
                { '@video': mediaName },
                { context: 'Skip links' },
              );
              skipLinkBefore.text = Drupal.t(
                'Continue below the @video video',
                { '@video': mediaName },
                { context: 'Skip links' },
              );
              mediaContainer.replaceWith(
                skipLinkBefore,
                containerElement,
                skipLinkAfter,
              );
              break;

            case 'chart':
              containerElement.classList.add(
                `responsive-${attributes.type}-container`,
              );
              skipLinkAfter.classList.add('skip-link--chart--after');
              skipLinkBefore.classList.add('skip-link--chart--before');

              // Adjust the skip link text based on whether the mediaName is found.
              skipLinkAfter.text = mediaName
                ? Drupal.t(
                    'Continue above the @chart chart',
                    { '@chart': mediaName },
                    { context: 'Skip links' },
                  )
                : Drupal.t(
                    'Continue above the chart',
                    {},
                    { context: 'Skip links' },
                  );
              skipLinkBefore.text = mediaName
                ? Drupal.t(
                    'Continue below the @chart chart',
                    { '@chart': mediaName },
                    { context: 'Skip links' },
                  )
                : Drupal.t(
                    'Continue below the chart',
                    {},
                    { context: 'Skip links' },
                  );

              mediaContainer.replaceWith(
                skipLinkBefore,
                containerElement,
                skipLinkAfter,
              );
              break;

            case 'journey_planner':
              containerElement.classList.add('journey-planner-container');
              skipLinkAfter.classList.add('skip-link--planner--after');
              skipLinkBefore.classList.add('skip-link--planner--before');
              skipLinkAfter.text = Drupal.t(
                'Continue above the journey planner',
                {},
                { context: 'Skip links' },
              );
              skipLinkBefore.text = Drupal.t(
                'Continue below the journey planner',
                {},
                { context: 'Skip links' },
              );
              mediaContainer.replaceWith(
                skipLinkBefore,
                containerElement,
                skipLinkAfter,
              );
              break;

            case 'map':
              containerElement.classList.add('responsive-map-container');
              skipLinkAfter.classList.add('skip-link--map--after');
              skipLinkBefore.classList.add('skip-link--map--before');

              // Adjust the skip link text based on whether the mediaName is found.
              skipLinkAfter.text = mediaName
                ? Drupal.t(
                    'Continue above the @map map',
                    { '@map': mediaName },
                    { context: 'Skip links' },
                  )
                : Drupal.t(
                    'Continue above the map',
                    {},
                    { context: 'Skip links' },
                  );
              skipLinkBefore.text = mediaName
                ? Drupal.t(
                    'Continue below the @map map',
                    { '@map': mediaName },
                    { context: 'Skip links' },
                  )
                : Drupal.t(
                    'Continue below the map',
                    {},
                    { context: 'Skip links' },
                  );

              mediaContainer.replaceWith(
                skipLinkBefore,
                containerElement,
                skipLinkAfter,
              );
              break;

            default:
              break;
          }
        });
      },
    );
  };

  // Remove noscript element.
  $('.embedded-content-cookie-compliance .js-remove').remove();

  if (Drupal.cookieConsent.initialized()) {
    loadEmbeddedContent();
  } else {
    Drupal.cookieConsent.loadFunction(loadEmbeddedContent);
  }
})(jQuery, Drupal, drupalSettings);
