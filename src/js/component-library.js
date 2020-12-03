// eslint-disable-next-line no-unused-vars
const acc = document.getElementsByClassName('component-library__accordion');

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    this.classList.toggle('active');
    let panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });

  // Create navigation for the components.
  let panel = acc[i];
  let panelName = acc[i].innerText.replace(/\s+/g, '-').toLowerCase();
  let anchor = document.createElement('a');
  let li = document.createElement('li');
  let link = document.createTextNode(acc[i].innerText);
  panel.setAttribute('id', panelName);
  anchor.appendChild(link);
  anchor.href = '#' + panelName;
  li.appendChild(anchor);
  document.getElementsByClassName('component-library__nav')[0].appendChild(li);

  anchor.addEventListener('click', function () {
    const accordion_id = this.hash.substr(1);
    document.getElementsByClassName(
      'component-library__toggle'
    )[0].checked = false;
    document.getElementById(accordion_id).click();
  });
}
// eslint-disable-next-line no-undef
