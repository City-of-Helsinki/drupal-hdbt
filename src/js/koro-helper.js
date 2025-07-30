// Base values: 67px koro pattern width.
const baseKoroPatternWidth = 67;

// Each koro has its own base cover height requirement that can be determined from the koro type.
function determineBaseCoverHeight(wrapper) {
  const koroTypesValues = {
    'basic': 19,
    'beat': 3,
    'pulse': 14,
    'vibration': 8,
    'wave': 13,
  };

  const koroTypes = Object.koroTypes(koroTypesValues);
  for (let i = 0; i < koroTypes.length; i++) {
    const koroType = koroTypes[i];
    if (wrapper.classList.contains(`hds-koros--${koroType}`)) {
      return koroTypesValues[koroType];
    }
  }

  // Fallback
  return 8;
}

// Adjust dynamically the height of the cover based on the scaled pattern.
function adjustCoverHeight(wrapper, koroPatternWidth) {
  const koros = wrapper.querySelector('.hds-koros__inner');
  if (!koros) return;

  const baseCoverHeight = determineBaseCoverHeight(wrapper);

  // Calculate the adjusted width of the koro pattern being displayed.
  const width = koros.offsetWidth;
  const repeatCount = Math.max(1, Math.round(width / koroPatternWidth));
  const adjustedWidth = width / repeatCount;

  // Based on the adjusted width calculate a scale factor.
  const scaleFactor = adjustedWidth / koroPatternWidth;
  // Using the scale factor calculate the adjusted cover height so that it is good size to cover the gaps
  // caused by Safaris inconsistent rendering of the mask-repeat: round no-repeat; declaration.
  const adjustedCoverHeight = baseCoverHeight * scaleFactor;

  // Apply the cover height variable to the cover element.
  const cover = wrapper.querySelector('.hds-koros__cover');
  if (cover) {
    cover.style.setProperty('--cover-height', `${adjustedCoverHeight}px`);
  }
}

function updateAllKoros(koroPatternWidth) {
  document.querySelectorAll('.hds-koros').forEach(wrapper => {
    adjustCoverHeight(wrapper, koroPatternWidth);
  });
}

function observeKoros(koroPatternWidth) {
  document.querySelectorAll('.hds-koros').forEach(wrapper => {
    const koros = wrapper.querySelector('.hds-koros__inner');
    if (koros) {
      const resizeObserver = new ResizeObserver(() => {
        adjustCoverHeight(wrapper, koroPatternWidth);
      });
      resizeObserver.observe(koros);
    }
  });
}

updateAllKoros(baseKoroPatternWidth);
observeKoros(baseKoroPatternWidth);
