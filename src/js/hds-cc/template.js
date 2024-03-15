export function getCookieBannerHtml(translations, groupsHtml) {
  return `
<div id="hds-cc" class="hds-cc hds-cc--minimized" tabindex="-1" role="region" aria-label="${translations.bannerAriaLabel}">
  <div class="hds-cc__container">
    <div class="hds-cc__aligner">

      <div class="hds-cc__main-content">
        <h2 class="hds-cc__heading">
          ${translations.heading}
        </h2>
        <div class="hds-cc__description">
          <p class="hds-cc__description__animator">
            ${translations.description}
          </p>
        </div>

        <span
          class="hds-cc__accordion-button hds-cc__accordion-button--read-more"
          aria-hidden="true"
          >${translations.readMore}</span>
      </div>

      <button
        type="button"
        class="hds-cc__accordion-button hds-cc__accordion-button--details hds-button hds-button--small hds-button--supplementary"
        onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');"
        aria-controls="hds-cc-form"
        aria-expanded="false"
        aria-live="polite">
        <span aria-hidden="true" class="hds-icon hds-icon--angle-down"></span>
        <span class="hds-cc__accordion-button-show hds-button__label">${translations.showDetails}</span>
        <span class="hds-cc__accordion-button-hide hds-button__label">${translations.hideDetails}</span>
      </button>

      <form action="" class="hds-cc__form" id="hds-cc-form">
        <div class="hds-cc__form__animator">
          <h3>${translations.form_heading}</h3>
          <p>${translations.form_text}</p>

          <div class="hds-cc__groups">
            ${groupsHtml}
          </div>
        </div>
      </form>
      <div class="hds-cc__buttons">
        <div class="hds-cc__buttons__animator">
          <div class="hds-cc__buttons__container">
            <button type="submit" class="hds-button hds-button--secondary hds-cc__all-cookies-button" data-approved="all">
              <span class="hds-button__label">${translations.approveAllConsents}</span>
            </button>
            <button type="submit" class="hds-button hds-button--secondary hds-cc__selected-cookies-button" data-approved="selected">
              <span class="hds-button__label">${translations.approveRequiredAndSelectedConsents}</span>
            </button>
            <button type="submit" class="hds-button hds-button--secondary hds-cc__required-cookies-button" data-approved="required">
              <span class="hds-button__label">${translations.approveOnlyRequiredConsents}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
};

// TODO: consider screenreader description parametrization (translations.screenreader.descriptions)
export function getGroupHtml(translations, groupId, groupUniqueId, tableRowsHtml, groupRequired) {
  const required = groupRequired ? ' checked disabled' : '';
  return `
            <div class="hds-cc__group">
              <div class="hds-checkbox">
                <input type="checkbox" id="${groupId}-cookies" class="hds-checkbox__input"${required} data-group="${groupId}" />
                <label for="${groupId}-cookies" class="hds-checkbox__label">${translations.title}</label>
              </div>
              <p>${translations.description}</p>

              <button
                type="button"
                class="hds-cc__accordion-button hds-cc__accordion-button--group-details hds-button hds-button--small hds-button--supplementary"
                onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');"
                aria-controls="hds-cc-group-details-${groupUniqueId}"
                aria-expanded="false"
                aria-live="polite">
                <span aria-hidden="true" class="hds-icon hds-icon--angle-down"></span>
                <span class="hds-cc__accordion-button-show hds-button__label">${translations.showCookieSettings}</span>
                <span class="hds-cc__accordion-button-hide hds-button__label">${translations.hideCookieSettings}</span>
              </button>
              <div class="hds-cc__group-details" id="hds-cc-group-details-${groupUniqueId}">
                <div class="hds-cc__group-details__animator">
                  <div class="hds-table-container" tabindex="0" role="region">
                    <table class="hds-table hds-table--dark">
                      <thead>
                        <tr class="hds-table__header-row">
                        <th scope="col">${translations.tableHeadingsName}</th>
                        <th scope="col">${translations.tableHeadingsHostName}</th>
                        <th scope="col">${translations.tableHeadingsDescription}</th>
                        <th scope="col">${translations.tableHeadingsExpiration}</th>
                        <th scope="col">${translations.tableHeadingsType}</th>
                        </tr>
                      </thead>
                      <tbody class="hds-table__content">
                        ${tableRowsHtml}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>`;
};

export function getTableRowHtml(rowData) {
  return `
                    <tr>
                      <td>${rowData.name}</td>
                      <td>${rowData.host}</td>
                      <td>${rowData.description}</td>
                      <td>${rowData.expiration}</td>
                      <td>${rowData.type}</td>
                    </tr>
                    `;
};
