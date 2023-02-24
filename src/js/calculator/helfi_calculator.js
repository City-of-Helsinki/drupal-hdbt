import globalTranslations from './_globalTranslations';

const Mustache = require('mustache');

class HelfiCalculator {
  constructor({ name, translations }) {
    this.name = name;
    this.templates = null;
    this.id = null;


    this.translations = { ...globalTranslations, ...translations };
  }

  t(key, values) {
    return this.translate(key, values);
  }

  translate(key, values) {
    if (!this.translations) {
      throw new Error('Translations are missing');
    }

    // https://stackoverflow.com/a/41540381
    function index(obj, is, value) {
      if (typeof is === 'string') {
        is = is.split('.');
      }
      if (is.length === 1 && value !== undefined) {
        obj[is[0]] = value;
        return value;
      }
      if (is.length === 0) {
        return obj;
      }
      return index(obj[is[0]], is.slice(1), value);
    }

    const lang = drupalSettings.path.currentLanguage || 'fi'; // TODO: Is this lang check ok?
    const translation = this.translations[key] ? this.translations[key][lang] : null;
    if (translation) {
      return translation.replace(/\$\{.+?\}/g, (match) => {
        const stripDollarAndParenthesis = match.replace(/(^\$\{|\}$)/g, '');
        return index(values, stripDollarAndParenthesis);
      });
    }
    return `Missing translation: ${key}:${lang}`;
  }

  parseSettings(settings) {
    let parsed;
    try {
      parsed = JSON.parse(settings);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Problem with ${this.name} settings:`, settings);
      throw e;
    }
    return parsed;
  }

  getElement(elemID) {
    const elem = document.querySelector(`#${elemID}_${this.id}`);
    if (!elem) {
      throw new Error(`Element #${elemID}_${this.id} missing from ${this.name} at getElement`);
    }

    return elem;
  }

  getPartialRender(template, partialData) {
    this.preprocessData(partialData);

    // console.log('template:', template);
    // console.log('preprocessed:', partialData);
    // console.log('partials:', this.templates.partials);

    return Mustache.render(
      template,
      partialData,
      this.templates.partials,
    );
  }

  preprocessData(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const value = obj[keys[i]];
      if (typeof value === 'object' && value !== null) {
        this.preprocessData(value);
        if (!value.hasOwnProperty('items')) {
          value.items = null;
        }
        if (!value.hasOwnProperty('group')) {
          value.group = null;
        }
        if (!value.hasOwnProperty('dynamic_area')) {
          value.dynamic_area = null;
        }
      } else if (typeof value === 'number') {
        obj[keys[i]] += ''; // convert numeric values to strings so that mustache does not think 0 === false and skip it.
      }
    }
  }

  getFieldValue(elemID) {
    const elem = document.querySelector(`#${elemID}_${this.id}`);
    if (!elem) {
      throw new Error(`Element #${elemID}_${this.id} missing from ${this.name} at getFieldValue`);
    }

    if (elem.dataset?.type === 'radio') {
      const checked = elem.querySelector('input:checked');
      if (checked) {
        return checked.value;
      }
      return null;
    }

    if (elem.dataset?.type === 'input_integer' || elem.dataset?.type === 'input_float') {

      // Check that required input has value
      if (elem.value === 'undefined' || elem.value === '') {
        return null;
      }

      let elemValue = elem.value.replace(',', '.');

      if (elem.dataset.strip) {
        const regex = new RegExp(elem.dataset.strip,'g');
        elemValue = elemValue.replaceAll(regex,'');
      }

      if (elem.dataset.type === 'input_integer' && Number.isNaN(Number.parseInt(elemValue, 10))) {
        return null;
      }

      if (elem.dataset.type === 'input_float' && Number.isNaN(Number.parseFloat(elemValue))) {
        return null;
      }

      return elemValue;
    }

  }

  getError(elemID, translationKey, translationParams) {

    const elem = document.querySelector(`#${elemID}_${this.id}`);
    if (!elem) {
      throw new Error(`Element #${elemID}_${this.id} missing from ${this.name} at validateBasics`);
    }

    const labelText = document.querySelector(`#labelText_${elem.id}`)?.innerText || elem.id;
    const labelLink = `<a href="#${elem.id}">${labelText}</a>`;


    const error = this.translate(translationKey, { labelLink, labelText, ...translationParams });
    const errorHtml = `<span class="hds-text-input__error-text">${error}</span>`;

    const elemFormItem = elem.closest('.form-item');
    if (elemFormItem) {
      elemFormItem.classList.add('hds-text-input--invalid');
      const errorContainer = elemFormItem.querySelector('.helfi-calculator__error-placeholder');
      if (errorContainer) {
        errorContainer.innerHTML = errorHtml;
      }
    }

    const errorWithLink = this.translate('error_with_link', { error, labelLink});
    return [errorWithLink];
  }

  validateBasics(elemID) {

    const elem = document.querySelector(`#${elemID}_${this.id}`);
    if (!elem) {
      throw new Error(`Element #${elemID}_${this.id} missing from ${this.name} at validateBasics`);
    }

    if (elem.dataset?.type === 'radio') {
      const checked = elem.querySelector('input:checked');
      if (!checked && elem.dataset.required) {
        return this.getError(elemID, 'select_radio');
      }
    }

    // Check number inputs
    if (elem.dataset?.type === 'input_integer' || elem.dataset?.type === 'input_float') {

      // Optional empty inputs can be ignored
      if (!elem.dataset.required && (typeof elem.value === 'undefined' || elem.value === '')) {
        return [];
      }

      // Check that required input has value
      if (elem.value === 'undefined' || elem.value === '') {
        return this.getError(elemID, 'enter_value');
      }

      let elemValue = elem.value.replace(',', '.');

      if (elem.dataset.strip) {
        const regex = new RegExp(elem.dataset.strip,'g');
        elemValue = elemValue.replaceAll(regex, '');
      }

      // Check if it's an integer number
      const integerRegex = /^-?([1-9][0-9]*|0)$/;
      if (elem.dataset.type === 'input_integer' && !integerRegex.test(elemValue)) {
        return this.getError(elemID, 'must_be_whole_number');
      }

      // Check if it's a decimal number or integer
      const floatRegex = /^-?([1-9][0-9]*|0)(\.[0-9]+)?$/;
      if (elem.dataset.type === 'input_float' && !floatRegex.test(elemValue)) {
        return this.getError(elemID, 'must_be_number');
      }

      // If both bounds are set
      if (typeof elem.dataset.min !== 'undefined' && typeof elem.dataset.max !== 'undefined') {
        if (Number.parseFloat(elem.dataset.min) > Number.parseFloat(elemValue) || elemValue > Number.parseFloat(elem.dataset.max)) {
          return this.getError(elemID, 'min_or_max_out_of_bounds', { min: elem.dataset.min, max: elem.dataset.max });
        }
        // Less than min
      } else if (typeof elem.dataset.min !== 'undefined') {
        if (Number.parseFloat(elem.dataset.min) > Number.parseFloat(elemValue)) {
          return this.getError(elemID, 'min_out_of_bounds', { min: elem.dataset.min });
        }
        // More than max
      } else if (typeof elem.dataset.max !== 'undefined') {
        if (Number.parseFloat(elemValue) > Number.parseFloat(elem.dataset.max)) {
          return this.getError(elemID, 'max_out_of_bounds', { max: elem.dataset.max });
        }
      }
    }
    return [];
  }


  hideGroup(id) {
    const elem = document.querySelector(`#${id}_${this.id}:not([data-hide-group='true'])`);
    if (elem && elem.dataset) {
      elem.dataset.hideGroup = true;
    }
  }

  showGroup(id) {
    const elem = document.querySelector(`#${id}_${this.id}[data-hide-group='true']`);
    if (elem && elem.dataset) {
      elem.dataset.hideGroup = false;
    }
  }

  static renderNotification(element, notificationClass, result, notificationAriaLabel) {
    let {message} = result;
    if (Array.isArray(result.message) && result.message.length > 1) {
      message = `<ul><li>${result.message.join('</li><li>')}</li></ul>`;
    }

    element.innerHTML = `
      <section aria-label="${notificationAriaLabel}" class="hds-notification ${notificationClass}">
        <div class="hds-notification__content">
          <h2 class="hds-notification__label">
            <span>${result.title}</span>
          </h2>
          <div class="hds-notification__body">${message}</div>
        </div>
      </section>`;
  }

  static renderReceipt(element, notificationClass, result, notificationAriaLabel) {
    let {message} = result;
    if (Array.isArray(result.message) && result.message.length > 1) {
      message = `<ul><li>${result.message.join('</li><li>')}</li></ul>`;
    }

    const html = `
      <section aria-label="${notificationAriaLabel}" class="hds-notification ${notificationClass}">
        <div class="hds-notification__content">
          <h2 class="hds-notification__label">
            <span>${result.title}</span>
          </h2>
          <div class="hds-notification__body">${message}</div>
        </div>
      </section>`;

    element.innerHTML = '';
    element.insertAdjacentHTML('beforeend', html);
    element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  }

  renderResult(result) {
    if (result.error) {
      HelfiCalculator.renderNotification(document.querySelector(`#${this.id} .helfi-calculator-notification--error`), 'hds-notification--error', result.error, this.translate('notification_aria_label_for_error'));
      const titleElem = document.querySelector(`#${this.id} .helfi-calculator-notification--error .hds-notification__label`);
      titleElem.setAttribute('tabindex', '0');
      titleElem.focus();
      titleElem.scrollIntoViewIfNeeded();
      titleElem.setAttribute('tabindex', '-1');
    }

    if (result.receipt) {
      document.querySelector(`#${this.id} .helfi-calculator-notification--result`).innerHTML = result.receipt;
    } else if (result.alert) {
      HelfiCalculator.renderNotification(document.querySelector(`#${this.id} .helfi-calculator-notification--result`), 'hds-notification--alert', result.alert, this.translate('notification_aria_label_for_alert'));
    } else if (result.info) {
      HelfiCalculator.renderReceipt(document.querySelector(`#${this.id} .helfi-calculator-notification--result`), 'hds-notification--info', result.info, this.translate('notification_aria_label_for_info'));
    }
  }

  clearResult() {
    document.querySelector(`#${this.id} .helfi-calculator-notification--error`).innerHTML = '';
    document.querySelector(`#${this.id} .helfi-calculator-notification--result`).innerHTML = '';
    const errors = document.querySelectorAll(`#${this.id} .hds-text-input--invalid`);
    Object.values(errors).forEach((error) => {
      error.classList.remove('hds-text-input--invalid');
    });
    const errorsMessages = document.querySelectorAll(`#${this.id} .helfi-calculator__error-placeholder`);
    Object.values(errorsMessages).forEach((errorMessage) => {
      errorMessage.innerHTML = '';
    });


    // this.init(this.initParams);
  }

  init({ id, formData, eventHandlers }) {
    this.initParams = { id, formData, eventHandlers };
    this.id = id;

    this.templates = {
      form: `
        <div class="helfi-calculator-disclaimer">
          {{#has_required_fields}}
            ${this.translate('has_required_fields', { required: '{{>required}}' }) }
          {{/has_required_fields}}
          ${this.translate('not_saved')}
        </div>
        <div class="helfi-calculator-notification helfi-calculator-notification--error" aria-live="polite" aria-atomic="true"></div>
        <form class="helfi-calculator" action="" method="post">
          {{#items}}
            {{>form_item}}
          {{/items}}
          <div class="helfi-calculator__buttons">
            <input type="submit" enterkeyhint="done" value="{{#submit}}{{submit}}{{/submit}}{{^submit}}${this.translate('calculate')}{{/submit}}" class="hds-button hds-button--primary">
            <input type="reset" value="{{#reset}}{{reset}}{{/reset}}{{^reset}}${this.translate('reset')}{{/reset}}" class="hds-button hds-button--secondary">
          </div>
        </form>
        <div class="helfi-calculator-notification helfi-calculator-notification--result" aria-live="polite" aria-atomic="true"></div>
      `,
      partials: {
        required: `
          <span class="visually-hidden">${this.translate('required')}</span><span aria-hidden="true" class="helfi-calculator-required">*</span>
        `,
        form_item: `
          <div class="helfi-calculator__item">
            {{#group}}{{>group}}{{/group}}
            {{#dynamic_area}}{{>dynamic_area}}{{/dynamic_area}}
            {{#heading}}{{>heading}}{{/heading}}
            {{#paragraph}}{{>paragraph}}{{/paragraph}}
            {{#hr}}{{>hr}}{{/hr}}
            {{#input}}{{>input}}{{/input}}
            {{#input_integer}}{{>input_integer}}{{/input_integer}}
            {{#input_float}}{{>input_float}}{{/input_float}}
            {{#radio}}{{>radio}}{{/radio}}
          </div>
        `,
        group: `
          <div id="{{id}}_{{form_id}}" class="helfi-calculator__group" {{#hide_group}}data-hide-group="true"{{/hide_group}}>
            <div>
              {{#items}}
                {{>form_item}}
              {{/items}}
            </div>
          </div>
        `,
        dynamic_slot: `
          <div id="{{id}}_{{form_id}}" class="helfi-calculator__dynamic-slot" {{#slotNumber}}data-slot-number="{{slotNumber}}"{{/slotNumber}}>
            <div>
              {{#items}}
                {{>form_item}}
              {{/items}}
              {{#remove_label}}
                <div class="helfi-calculator__dynamic-remove-wrapper"><button class="helfi-calculator__dynamic-remove hds-button hds-button--supplementary"><span class="hds-button__label">{{remove_label}}</span><span class="hel-icon hel-icon--cross" role="img" aria-hidden="true"></button></div>
              {{/remove_label}}
            </div>
          </div>
        `,
        dynamic_area: `
          <div id="{{id}}_{{form_id}}" class="helfi-calculator__dynamic-area">
            <div id="slots_{{id}}_{{form_id}}" class="helfi-calculator__dynamic-area__slots">
              {{#dynamic_slots}}
                {{>dynamic_slot}}
              {{/dynamic_slots}}
            </div>
            {{#add_button_label}}
              <button id="add-button_{{id}}_{{form_id}}" class="hds-button hds-button--secondary"><span class="hel-icon hel-icon--plus" role="img" aria-hidden="true"></span><span class="hds-button__label">{{add_button_label}}</span></button>
            {{/add_button_label}}
          </div>
        `,
        heading: `
          <h{{level}}{{^level}}2{{/level}}>{{text}}</h{{level}}{{^level}}2{{/level}}>
        `,
        paragraph: `
          <p>{{text}}</p>
        `,
        hr: `
          <hr>
        `,
        error_placeholder: `
          <div class="helfi-calculator__error-placeholder"></div>
        `,
        input: `
          <div class="form-item hds-text-input {{#required}}input--required{{/required}}">
            {{#label}}<label class="hds-text-input__label" for="{{id}}_{{form_id}}" id="label_{{id}}_{{form_id}}"><span id="labelText_{{id}}_{{form_id}}" class="label_text">{{label}}</span>{{#unit}} ({{unit}}){{/unit}}{{#required}}{{>required}}{{/required}}</label>{{/label}}
            <div class="hds-text-input__input-wrapper">
              <input
                type="{{type}}"
                data-type="input"
                id="{{id}}_{{form_id}}"
                name="{{id}}"
                {{#inputmode}}inputmode="{{inputmode}}"{{/inputmode}}
                {{#pattern}}pattern="{{pattern}}"{{/pattern}}
                {{#min}}data-min="{{min}}"{{/min}}
                {{#max}}data-max="{{max}}"{{/max}}
                {{#size}}size="{{size}}"{{/size}}
                {{#maxlength}}maxlength="{{maxlength}}"{{/maxlength}}
                {{#required}}data-required="required"{{/required}}
                {{#strip}}data-strip="{{strip}}"{{/strip}}
                {{#label}}data-label="{{label}}"{{/label}}
                {{#value}}value="{{value}}"{{/value}}
                class="form-text hds-text-input__input">
            </div>
            {{>error_placeholder}}
            {{#helper_text}}<span class="hds-text-input__helper-text">{{helper_text}}</span>{{/helper_text}}
          </div>
        `,
        input_integer: `
          <div class="form-item hds-text-input {{#required}}input--required{{/required}}">
            {{#label}}<label class="hds-text-input__label" for="{{id}}_{{form_id}}" id="label_{{id}}_{{form_id}}"><span id="labelText_{{id}}_{{form_id}}" class="label_text">{{label}}</span>{{#unit}} ({{unit}}){{/unit}}{{#required}}{{>required}}{{/required}}</label>{{/label}}
            <div class="hds-text-input__input-wrapper">
              <input
                type="text"
                data-type="input_integer"
                id="{{id}}_{{form_id}}"
                name="{{id}}"
                inputmode="numeric"
                {{#min}}data-min="{{min}}"{{/min}}
                {{#max}}data-max="{{max}}"{{/max}}
                {{#size}}size="{{size}}"{{/size}}
                {{#maxlength}}maxlength="{{maxlength}}"{{/maxlength}}
                {{#required}}data-required="required"{{/required}}
                {{#strip}}data-strip="{{strip}}"{{/strip}}
                data-label="label_{{id}}_{{form_id}}"
                {{#value}}value="{{value}}"{{/value}}
                class="form-text hds-text-input__input">
            </div>
            {{>error_placeholder}}
            {{#helper_text}}<span class="hds-text-input__helper-text">{{helper_text}}</span>{{/helper_text}}
          </div>
        `,
        input_float: `
          <div class="form-item hds-text-input {{#required}}input--required{{/required}}">
            {{#label}}<label class="hds-text-input__label" for="{{id}}_{{form_id}}" id="label_{{id}}_{{form_id}}"><span id="labelText_{{id}}_{{form_id}}" class="label_text">{{label}}</span>{{#unit}} ({{unit}}){{/unit}}{{#required}}{{>required}}{{/required}}</label>{{/label}}
            <div class="hds-text-input__input-wrapper">
              <input
                type="text"${''/* We can not use numeric here, nor can we use inputmode decimal https://design-system.service.gov.uk/components/text-input/#asking-for-decimal-numbers */}
                data-type="input_float"
                id="{{id}}_{{form_id}}"
                name="{{id}}"
                {{#min}}data-min="{{min}}"{{/min}}
                {{#max}}data-max="{{max}}"{{/max}}
                {{#size}}size="{{size}}"{{/size}}
                {{#maxlength}}maxlength="{{maxlength}}"{{/maxlength}}
                {{#required}}data-required="required"{{/required}}
                {{#strip}}data-strip="{{strip}}"{{/strip}}
                {{#value}}value="{{value}}"{{/value}}
                class="form-text hds-text-input__input">
            </div>
            {{>error_placeholder}}
            {{#helper_text}}<span class="hds-text-input__helper-text">{{helper_text}}</span>{{/helper_text}}
          </div>
        `,
        radio: `
          <fieldset
              data-type="radio"
              id="{{id}}_{{form_id}}"
              {{#required}}data-required="true"{{/required}}
              class="form-item hds-selection-group {{#required}}input--required{{/required}}">
            {{#label}}<legend class="hds-selection-group__legend" id="label_{{id}}_{{form_id}}"><span id="labelText_{{id}}_{{form_id}}" class="label_text">{{label}}</span>{{#unit}} ({{unit}}){{/unit}}{{#required}}{{>required}}{{/required}}</legend>{{/label}}
            <div class="hds-selection-group__items">
              {{#radio_items}}
                {{>radio_item}}
              {{/radio_items}}
            </div>
            {{>error_placeholder}}
            {{#helper_text}}<span class="hds-text-input__helper-text">{{helper_text}}</span>{{/helper_text}}
          </fieldset>
        `,
        radio_item: `
          <div class="hds-selection-group__item">
            <div class="hds-radio-button">
              <input
                type="radio"
                id="{{item_id}}_{{form_id}}"
                name="{{name}}"
                {{#required}}data-required="required"{{/required}}
                data-label="label_{{id}}_{{form_id}}"
                value="{{value}}"
                class="hds-radio-button__input">
              <label for="{{item_id}}_{{form_id}}" class="hds-radio-button__label">{{label}}</label>
            </div>
          </div>
        `,
        receipt: `
          <div class="helfi-calculator__receipt" id="receipt_{{id}}">
            <div class="helfi-calculator__receipt__wrapper">
              <div class="helfi-calculator__receipt__container">
                <h2>{{title}}</h2>
                <p class="helfi-calculator__receipt-total">
                  <span class="helfi-calculator__receipt-total__prefix">{{total_prefix}}</span>
                  <span class="helfi-calculator__receipt-total__value">{{total_value}}</span>
                  <span class="helfi-calculator__receipt-total__suffix">{{total_suffix}}</span>
                </p>
                {{#total_explanation}}
                  <p class="helfi-calculator__receipt-total-explanation">{{total_explanation}}</p>
                {{/total_explanation}}
                {{#hr}}
                  <hr class="helfi-calculator__receipt-hr" />
                {{/hr}}
                {{#breakdown}}
                  <h3>{{title}}</h3>
                  {{#subtotals}}
                    {{>subtotal}}
                  {{/subtotals}}
                  {{#additional_details}}
                    {{#title}}<h4>{{.}}</h4>{{/title}}
                    {{#text}}<p>{{.}}</p>{{/text}}
                  {{/additional_details}}
                {{/breakdown}}
              </div>
            </div>
          </div>
        `,
        subtotal: `
          <div class="helfi-calculator__receipt-subtotal">
            <h4>{{title}}</h4>
            {{#has_details}}
              <ul>
              {{#details}}
                <li>{{.}}</li>
              {{/details}}
              </ul>
            {{/has_details}}
            <span class="helfi-calculator__receipt-subtotal-sum">{{sum}}</span>
          </div>
        `,
      }
    };

    this.preprocessData(formData);
    const processedData = formData;

    const render = Mustache.render(
      this.templates.form,
      processedData,
      this.templates.partials,
    );

    document.getElementById(this.id).innerHTML = render;

    const events = Object.keys(eventHandlers);
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      document.getElementById(id).addEventListener(event, eventHandlers[event]);
      // console.log('Started waiting for', event, '-events');
    }
  }
}


// module.exports = () => new HelfiCalculator();
window.HelfiCalculator = (translations) => new HelfiCalculator(translations);


