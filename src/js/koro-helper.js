((Drupal) => {
  // Base values: 67px koro pattern width.
  const baseKoroPatternWidth = 67;

  // Each koro has its own base cover height requirement that can be determined from the koro type.
  function getKoroConfig(wrapper) {
    const koroTypesValues = {
      'basic': { baseCoverHeight: 19, scaleBoost: 2 },
      'beat': { baseCoverHeight: 3, scaleBoost: 10 },
      'pulse': { baseCoverHeight: 14, scaleBoost: 3 },
      'vibration': { baseCoverHeight: 7, scaleBoost: 8 },
      'wave': { baseCoverHeight: 13, scaleBoost: 4 },
    };

    const koroTypes = Object.keys(koroTypesValues);
    for (let i = 0; i < koroTypes.length; i++) {
      const koroType = koroTypes[i];
      if (wrapper.classList.contains(`hds-koros--${koroType}`)) {
        return koroTypesValues[koroType];
      }
    }

    // Fallback
    return { baseCoverHeight: 8, scaleBoost: 1 };
  }

  // Adjust dynamically the height of the cover based on the scaled pattern.
  function adjustCoverHeight(wrapper, koroPatternWidth) {
    const koros = wrapper.querySelector('.hds-koros__inner');
    if (!koros) return;

    const { baseCoverHeight, scaleBoost } = getKoroConfig(wrapper);

    // Calculate the adjusted width of the koro pattern being displayed.
    const width = koros.offsetWidth;
    const repeatCount = Math.max(1, Math.round(width / koroPatternWidth));

    // We are calculating the average rendered width of one pattern unit, then comparing that to the base (67px).
    // If the result is > 1, it means the pattern is being stretched.
    // If it’s < 1, the pattern is being shrunk.
    const adjustedWidth = width / repeatCount;

    // Based on the adjusted width calculate a scale factor.
    // Different koro patterns require different scaleFactor based on their deviation from the center.
    // This is factored in using the scaleBoost variable.
    const rawFactor = koroPatternWidth / adjustedWidth;
    const scaleFactor = 1 + (rawFactor - 1) * scaleBoost;

    // Using the scale factor calculate the adjusted cover height so that it is good size to cover the gaps
    // caused by Safari's inconsistent rendering of the mask-repeat: round no-repeat; declaration.
    const adjustedCoverHeight = baseCoverHeight * scaleFactor;

    // Apply the cover height variable to the cover element.
    const cover = wrapper.querySelector('.hds-koros__cover');
    if (cover) {
      cover.style.setProperty('--cover-height', `${adjustedCoverHeight}px`);
    }
  }

  // Loop through all koros and update their cover height.
  function updateAllKoros(koroPatternWidth, context) {
    const wrappers = (context || document).querySelectorAll('.hds-koros');
    wrappers.forEach(wrapper => {
      adjustCoverHeight(wrapper, koroPatternWidth);
    });
  }

  // Observe each koro for resizing and update their cover height accordingly.
  function observeKoros(koroPatternWidth, context) {
    const wrappers = (context || document).querySelectorAll('.hds-koros');
    wrappers.forEach(wrapper => {
      const koros = wrapper.querySelector('.hds-koros__inner');
      if (koros) {
        const resizeObserver = new ResizeObserver(() => {
          adjustCoverHeight(wrapper, koroPatternWidth);
        });
        resizeObserver.observe(koros);
      }
    });
  }

  // Attach behavior to ensure compatibility with BigPipe and other dynamic rendering.
  Drupal.behaviors.korosAdjuster = {
    attach(context) {
      updateAllKoros(baseKoroPatternWidth, context);
      observeKoros(baseKoroPatternWidth, context);
    }
  };

})(Drupal);
