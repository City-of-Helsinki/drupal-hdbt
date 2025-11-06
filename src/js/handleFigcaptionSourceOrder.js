// CKEditor creates a <table> markup with <figcaption> after the <tbody>.
// Fix the source order with JS.
document.querySelectorAll('.user-edited-content figure').forEach((figure) => {
  // Adding tabindex="0"
  figure.setAttribute('tabindex', '0');

  // Finding the figcaption element
  const figcaption = figure.querySelector('figcaption');

  if (figcaption) {
    // Removing figcaption from its current position
    figcaption.remove();

    // Inserting figcaption as the first child of the figure element
    figure.insertBefore(figcaption, figure.firstChild);
  }
});
