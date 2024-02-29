export default function getCookieBannerHTML() {
  const html = `
<div id="hds-cc" class="hds-cc hds-cc--minimized" tabindex="-1">
  <div class="hds-cc__container">
    <div class="hds-cc__aligner">

      <div class="hds-cc__main-content">
        <h2 class="hds-cc__heading">
          This website uses cookies
        </h2>
        <div class="hds-cc__description">
          <p class="hds-cc__description__animator">
            This website uses required cookies to ensure the basic functionality and performance. In addition, we use targeting cookies to improve the user experience, perform analytics and display personalised content.
          </p>
        </div>

        <span
          class="hds-cc__accordion-button hds-cc__accordion-button--read-more"
          aria-hidden="true"
          {# onclick="this.closest('#hds-cc').blur()" #}
          {# onclick="this.closest('#hds-cc').classList.toggle('hds-cc--minimized')" #}
          >Read more</span>
      </div>

      <button
        type="button"
        class="hds-cc__accordion-button hds-cc__accordion-button--details hds-button hds-button--small hds-button--supplementary"
        onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');"
        aria-controls="hds-cc-form"
        aria-expanded="false"
        aria-polite="true">
        <span class="hds-cc__accordion-button-show hds-button__label">Show cookie settings</span>
        <span class="hds-cc__accordion-button-hide hds-button__label">Hide cookie settings</span>
        <span aria-hidden="true" class="hds-icon hds-icon--angle-down"></span>
      </button>

      <form action="" class="hds-cc__form" id="hds-cc-form">
        <div class="hds-cc__form__animator">
          <h3>About the cookies used on the website</h3>
          <p>The cookies used on the website have been classified according to their intended use. Below, you can read about the various categories and accept or reject the use of cookies.</p>

          <div class="hds-cc__groups">
            <div id="lists"></div>

            {# Repeatable group start #}
            <div class="hds-cc__group">
              <div class="hds-checkbox">
                <input type="checkbox" id="necessary-cookies" class="hds-checkbox__input" />
                <label for="necessary-cookies" class="hds-checkbox__label">Necessary cookies</label>
              </div>
              <p aria-hidden="true">Necessary cookies cannot be rejected. They enable the proper functioning of the website and affect the usability.</p>
              <p class="visually-hidden">Necessary cookies cannot be rejected. They enable the proper functioning of the website and affect the usability.</p>

              <button
                type="button"
                class="hds-cc__accordion-button hds-cc__accordion-button--group-details hds-button hds-button--small hds-button--supplementary"
                onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');"
                aria-controls="hds-cc-group-details-1"
                aria-expanded="false"
                aria-polite="true">
                <span class="hds-cc__accordion-button-show hds-button__label">Show cookie settings</span>
                <span class="hds-cc__accordion-button-hide hds-button__label">Hide cookie settings</span>
                <span aria-hidden="true" class="hds-icon hds-icon--angle-down"></span>
              </button>
              <div class="hds-cc__group-details" id="hds-cc-group-details-1">
                <div class="hds-cc__group-details__animator hds-table-container" tabindex="0" role="region" aria-label="Cookies related to necessary cookies">
                  <table class="hds-table hds-table--dark">
                    <thead>
                      <tr class="hds-table__header-row">
                        <th scope="col">Name</th>
                        <th scope="col">Cookie set by</th>
                        <th scope="col">Purpose of use</th>
                        <th scope="col">Period of validity</th>
                      </tr>
                    </thead>
                    <tbody class="hds-table__content">
                      {# Repeatable cookie details start #}
                      <tr>
                        <td>SSESS*</td>
                        <td>hel.fi</td>
                        <td>A cookie related to the operation of the content management system.</td>
                        <td>23 days</td>
                      </tr>
                      {# Repeatable cookie details end #}
                      {# Repeatable cookie details start #}
                      <tr>
                        <td>SSESS*</td>
                        <td>hel.fi</td>
                        <td>A cookie related to the operation of the content management system.</td>
                        <td>23 days</td>
                      </tr>
                      {# Repeatable cookie details end #}
                      {# Repeatable cookie details start #}
                      <tr>
                        <td>SSESS*</td>
                        <td>hel.fi</td>
                        <td>A cookie related to the operation of the content management system.</td>
                        <td>23 days</td>
                      </tr>
                      {# Repeatable cookie details end #}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            {# Repeatable group end #}

            {# Repeatable group start #}
            <div class="hds-cc__group">
              <div class="hds-checkbox">
                <input type="checkbox" id="advertising-cookies" class="hds-checkbox__input" />
                <label for="advertising-cookies" class="hds-checkbox__label">Advertising and marketing</label>
              </div>
              <p aria-hidden="true">Marketing cookies can be used to target content to users of the website.</p>
              <p class="visually-hidden">Marketing cookies can be used to target content to users of the website.</p>

              <button
                type="button"
                class="hds-cc__accordion-button hds-cc__accordion-button--group-details hds-button hds-button--small hds-button--supplementary"
                onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') === 'false' ? 'true' : 'false');"
                aria-controls="hds-cc-group-details-2"
                aria-expanded="false"
                aria-polite="true">
                <span class="hds-cc__accordion-button-show hds-button__label">Show cookie settings</span>
                <span class="hds-cc__accordion-button-hide hds-button__label">Hide cookie settings</span>
                <span aria-hidden="true" class="hds-icon hds-icon--angle-down"></span>
              </button>
              <div class="hds-cc__group-details" id="hds-cc-group-details-2">
                <div class="hds-cc__group-details__animator hds-table-container" tabindex="0" role="region" aria-label="Cookies related to necessary cookies">
                  <table class="hds-table hds-table--dark">
                    <thead>
                      <tr class="hds-table__header-row">
                        <th scope="col">Name</th>
                        <th scope="col">Cookie set by</th>
                        <th scope="col">Purpose of use</th>
                        <th scope="col">Period of validity</th>
                      </tr>
                    </thead>
                    <tbody class="hds-table__content">
                      {# Repeatable cookie details start #}
                      <tr>
                        <td>SSESS*</td>
                        <td>hel.fi</td>
                        <td>A cookie related to the operation of the content management system.</td>
                        <td>23 days</td>
                      </tr>
                      {# Repeatable cookie details end #}
                      {# Repeatable cookie details start #}
                      <tr>
                        <td>SSESS*</td>
                        <td>hel.fi</td>
                        <td>A cookie related to the operation of the content management system.</td>
                        <td>23 days</td>
                      </tr>
                      {# Repeatable cookie details end #}
                      {# Repeatable cookie details start #}
                      <tr>
                        <td>SSESS*</td>
                        <td>hel.fi</td>
                        <td>A cookie related to the operation of the content management system.</td>
                        <td>23 days</td>
                      </tr>
                      {# Repeatable cookie details end #}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
            {# Repeatable group end #}

          </div>
        </div>
      </form>
      <div class="hds-cc__buttons">
        <div class="hds-cc__buttons__animator">
          <div class="hds-cc__buttons__container">
            <button type="submit" class="hds-button hds-button--secondary hds-cc__all-cookies-button">
              <span class="hds-button__label">Accept all cookies</span>
            </button>
            <button type="submit" class="hds-button hds-button--secondary hds-cc__selected-cookies-button">
              <span class="hds-button__label">Accept selected cookies</span>
            </button>
            <button type="submit" class="hds-button hds-button--secondary hds-cc__required-cookies-button">
              <span class="hds-button__label">Accept required cookies only</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;
  return html;
}
