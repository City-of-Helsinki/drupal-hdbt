// eslint-disable-next-line no-unused-vars
const acc = document.getElementsByClassName("component-library__accordion");

for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function activate() {
    this.classList.toggle("active");
    const panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });

  // Create navigation for the components.
  const panel = acc[i];
  const panelName = acc[i].innerText.replace(/\s+/g, "-").toLowerCase();
  const anchor = document.createElement("a");
  const li = document.createElement("li");
  const link = document.createTextNode(acc[i].innerText);
  panel.setAttribute("id", panelName);
  anchor.appendChild(link);
  anchor.href = `#${panelName}`;
  li.appendChild(anchor);
  document.getElementsByClassName("component-library__nav")[0].appendChild(li);

  anchor.addEventListener("click", function clickOnAccordion() {
    const accordionId = this.hash.substr(1);
    document.getElementsByClassName(
      "component-library__toggle"
    )[0].checked = false;
    document.getElementById(accordionId).click();
  });
}
// eslint-disable-next-line no-undef
