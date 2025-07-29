// Base values: 67px tile width and 8px seam height at that size.
const baseTileWidth = 67;

function determineBaseSeamHeight(wrapper) {
  const koroTypes = {
    'basic': 19,
    'beat': 3,
    'pulse': 14,
    'vibration': 8,
    'wave': 13,
  };

  const keys = Object.keys(koroTypes);
  for (let i = 0; i < keys.length; i++) {
    const type = keys[i];
    if (wrapper.classList.contains(`hds-koros--${type}`)) {
      return koroTypes[type];
    }
  }

  // Fallback
  return 8;
}

function adjustKorosPattern(wrapper, tileWidth) {
  const koros = wrapper.querySelector('.hds-koros__inner');
  if (!koros) return;

  const baseSeamHeight = determineBaseSeamHeight(wrapper);

  const width = koros.offsetWidth;
  const repeatCount = Math.max(1, Math.round(width / tileWidth));
  const adjustedWidth = width / repeatCount;

  koros.style.setProperty('--pattern-width', `${adjustedWidth}px`);

  const scaleFactor = adjustedWidth / tileWidth;
  const adjustedSeamHeight = baseSeamHeight * scaleFactor;

  const seamBlocker = wrapper.querySelector('.hds-koros__cover');
  if (seamBlocker) {
    seamBlocker.style.setProperty('--cover-height', `${adjustedSeamHeight}px`);
  }
}

function updateAllKoros(tileWidth) {
  document.querySelectorAll('.hds-koros').forEach(wrapper => {
    adjustKorosPattern(wrapper, tileWidth);
  });
}

function observeKoros(tileWidth) {
  document.querySelectorAll('.hds-koros').forEach(wrapper => {
    const koros = wrapper.querySelector('.hds-koros__inner');
    if (koros) {
      const ro = new ResizeObserver(() => {
        adjustKorosPattern(wrapper, tileWidth);
      });
      ro.observe(koros);
    }
  });
}

// Kick it off
updateAllKoros(baseTileWidth);
observeKoros(baseTileWidth);
