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

  /**
   * Nudge iframe dimensions so a cross-origin Leaflet map gets window.resize.
   *
   * Palvelukartta mounts Leaflet asynchronously after document load. Leaflet
   * listens to window.resize and calls invalidateSize(); changing the iframe
   * box from the parent is the reliable way to trigger that without
   * same-origin access.
   *
   * @param {HTMLIFrameElement} iframeElement
   *   Map iframe whose content window should receive resize.
   */
  const nudgeIframeForLeaflet = (iframeElement) => {
    const width = iframeElement.offsetWidth;
    if (!width) {
      return;
    }

    // 1px is not always enough for the iframe content window to emit resize;
    // 2px reliably triggers Leaflet's invalidateSize handler.
    iframeElement.style.width = `${width - 2}px`;
    // Force layout so the intermediate size is applied before restoring.
    void iframeElement.offsetWidth;
    iframeElement.style.width = '';
  };

  /**
   * Schedule size nudges after iframe load so Leaflet can invalidateSize.
   *
   * SPA map init happens after document load, so a single immediate nudge is
   * not enough; nudge across that window instead.
   *
   * @param {HTMLIFrameElement} iframeElement
   *   Map iframe to nudge after it loads.
   */
  const scheduleLeafletIframeNudges = (iframeElement) => {
    const leafletNudgeDelaysMs = [100, 500, 1000, 2000, 4000];
    let nudgeTimeouts = [];

    const clearNudgeTimeouts = () => {
      nudgeTimeouts.forEach((id) => {
        clearTimeout(id);
      });
      nudgeTimeouts = [];
    };

    iframeElement.addEventListener('load', () => {
      clearNudgeTimeouts();
      nudgeTimeouts = leafletNudgeDelaysMs.map((delay) =>
        setTimeout(() => nudgeIframeForLeaflet(iframeElement), delay),
      );
    });
  };

  const loadEmbeddedContent = () => {
    Object.entries(drupalSettings?.embedded_media_attributes || {}).forEach(([id, attributes]) => {
      if (!categoriesAgreed(attributes?.cookieConsentGroups)) {
        return;
      }

      const mediaContainers = $(`.embedded-content-cookie-compliance.media-${id}`);

      // Each of the media type is grouped to their own
      // mediaContainers so we need to iterate through them.
      mediaContainers.each(function processMediaContainer(index) {
        const mediaContainer = $(this);

        const iframeElement = document.createElement('iframe');
        iframeElement.classList.add('media-oembed-content');
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

        // Register before assigning src so a fast/cached load is not missed.
        if (attributes.type === 'map') {
          scheduleLeafletIframeNudges(iframeElement);
        }
        iframeElement.src = attributes.src;

        const containerElement = document.createElement('div');
        containerElement.appendChild(iframeElement);

        // Extract the media name from the wrapping component title or in
        // case of video, from the remote video - video title.
        // Fallback to empty if no title is set.
        let mediaName = '';
        switch (attributes.type) {
          case 'video':
            mediaName = mediaContainer.parent().siblings('.remote-video__video-title').text().trim() || '';
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
            containerElement.classList.add(`responsive-${attributes.type}-container`);
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
            mediaContainer.replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
            break;

          case 'chart':
            containerElement.classList.add(`responsive-${attributes.type}-container`);
            skipLinkAfter.classList.add('skip-link--chart--after');
            skipLinkBefore.classList.add('skip-link--chart--before');

            // Adjust the skip link text based on whether the mediaName is found.
            skipLinkAfter.text = mediaName
              ? Drupal.t('Continue above the @chart chart', { '@chart': mediaName }, { context: 'Skip links' })
              : Drupal.t('Continue above the chart', {}, { context: 'Skip links' });
            skipLinkBefore.text = mediaName
              ? Drupal.t('Continue below the @chart chart', { '@chart': mediaName }, { context: 'Skip links' })
              : Drupal.t('Continue below the chart', {}, { context: 'Skip links' });

            mediaContainer.replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
            break;

          case 'journey_planner':
            containerElement.classList.add('journey-planner-container');
            skipLinkAfter.classList.add('skip-link--planner--after');
            skipLinkBefore.classList.add('skip-link--planner--before');
            skipLinkAfter.text = Drupal.t('Continue above the journey planner', {}, { context: 'Skip links' });
            skipLinkBefore.text = Drupal.t('Continue below the journey planner', {}, { context: 'Skip links' });
            mediaContainer.replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
            break;

          case 'map':
            containerElement.classList.add('responsive-map-container');
            skipLinkAfter.classList.add('skip-link--map--after');
            skipLinkBefore.classList.add('skip-link--map--before');

            // Adjust the skip link text based on whether the mediaName is found.
            skipLinkAfter.text = mediaName
              ? Drupal.t('Continue above the @map map', { '@map': mediaName }, { context: 'Skip links' })
              : Drupal.t('Continue above the map', {}, { context: 'Skip links' });
            skipLinkBefore.text = mediaName
              ? Drupal.t('Continue below the @map map', { '@map': mediaName }, { context: 'Skip links' })
              : Drupal.t('Continue below the map', {}, { context: 'Skip links' });

            mediaContainer.replaceWith(skipLinkBefore, containerElement, skipLinkAfter);
            break;

          default:
            break;
        }
      });
    });
  };

  // Remove noscript element.
  $('.embedded-content-cookie-compliance .js-remove').remove();

  if (Drupal.cookieConsent.initialized()) {
    loadEmbeddedContent();
  } else {
    Drupal.cookieConsent.loadFunction(loadEmbeddedContent);
  }

  // Re-run the loadEmbeddedContent when cookie consent changes.
  window.addEventListener('hds-cookie-consent-changed', loadEmbeddedContent);
})(jQuery, Drupal, drupalSettings);
