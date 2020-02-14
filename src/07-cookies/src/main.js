'use strict';

/* The class responsible for validating the expected font size. */
class InputValidator {
  constructor(selector) {
    this.selector = selector;
  }

  // Only numbers allowed.
  aoNumbers() {
    let element = document.querySelector(this.selector);

    let containsLettersOrSymbols = /[a-zA-Z$-/:-?{-~!"^_`\[\]]/gm.test(
        element.value);
    if (containsLettersOrSymbols) {
      throw new Error('The string is in the wrong format.');
    }

    return true;
  }
}

class BaseDataStorage {
  storage;

  constructor() {
    this.expires = new Expires();
    this.expires.toMonth();
  }
}

class FontSizeDataStorage extends BaseDataStorage {
  constructor(value) {
    super();
    this.storage = new DataSaver(new CookiesDataSaver({
      name: 'settings-font-size',
      value: value,
      expires: this.expires,
    }));
  }
}

class ThemeDataStorage extends BaseDataStorage {
  constructor() {
    super();
  }

  initial() {
    this.idStorage = new DataSaver(new CookiesDataSaver({
      name: 'settings-theme-id',
      value: 6,
      expires: this.expires,
    }));
    this.idStorage.baseDataSaver.readOrSave();

    this.colorStorage = new DataSaver(new CookiesDataSaver({
      name: 'settings-theme-color',
      value: '#35363B',
      expires: this.expires,
    }));
    this.colorStorage.baseDataSaver.readOrSave();
  }
}

class BaseCookies {
  dataStorage;

  constructor(selector) {
    this.selector = selector;
  }

  save() {}

  apply() {}
}

class FontSizeCookies extends BaseCookies {
  constructor(selector) {
    super(selector);
    this.dataStorage = new FontSizeDataStorage(this.fontSize());
  }

  fontSize(value = 0) {
    if (value === 0) {
      return this.selector.value;
    }

    this.selector.value = value;
  }

  save() {
    this.dataStorage.storage.baseDataSaver.item.value = this.fontSize();
    this.dataStorage.storage.baseDataSaver.save();
  }

  apply() {
    document.querySelector('body').style.fontSize = `${this.selector.value}pt`;
  }
}

class ThemeCookies extends BaseCookies {
  constructor(selector) {
    super(selector);
    this.dataStorage = new ThemeDataStorage();
    this.dataStorage.initial();
  }

  simulateSelect() {
    themes[this.dataStorage.idStorage.baseDataSaver.readOrSave() - 1].click();
  }

  save() {
    this.selector.forEach(e => e.addEventListener('click', () => {
      this.dataStorage.idStorage.baseDataSaver.item.value = e.dataset.checkedId;
      this.dataStorage.colorStorage.baseDataSaver.item.value = e.dataset.color;

      this.reset();
      e.dataset.isChecked = 'true';

      let element = document.createElement('i');
      element.classList.add('fa', 'fas', 'fa-check-circle', 'float-right',
          'mt-1');
      e.appendChild(element);

      this.dataStorage.idStorage.baseDataSaver.save();
      this.dataStorage.colorStorage.baseDataSaver.save();
    }));
  }

  reset() {
    this.selector.forEach(e => {
      e.dataset.isChecked = 'false';
      for (const key of e.children) {
        if (key.classList.contains('fa')) {
          key.remove();
          break;
        }
      }
    });
  }

  apply() {
    document.querySelector(
        'body').style.backgroundColor = `${this.dataStorage.colorStorage.baseDataSaver.item.value}`;
  }
}

let fontSizeCookies = new FontSizeCookies(document.querySelector('#font-size'));
let themes = document.querySelectorAll('.dropdown-item[data-is-checked]');
let themeCookies = new ThemeCookies(themes);

/* Prepare the page. */
window.addEventListener('load', () => {
  fontSizeCookies.fontSize(
      fontSizeCookies.dataStorage.storage.fromStorageOrNew());
  fontSizeCookies.apply();

  themeCookies.save();
  themeCookies.simulateSelect();
  themeCookies.apply();
});

/* Input validation and related behavior. */
let applyButton = document.querySelector('.button-apply');
let fontSizeValidator = new InputValidator('#font-size');
applyButton.addEventListener('click', function() {
  function inputCheck() {
    try {
      fontSizeValidator.aoNumbers();
      processComplete();
    } catch (err) {
      console.log(err.message);
      processError();
    }
  }

  function showSaveAlert() {
    Swal.fire({
      title: 'Successfully',
      text: 'Settings saved and applied.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  function processComplete() {
    applyButton.classList.add('btn-primary');
    applyButton.classList.remove('btn-danger');
    applyButton.classList.remove('disabled');

    fontSizeCookies.save();
    fontSizeCookies.apply();

    themeCookies.save();
    themeCookies.apply();

    showSaveAlert();
  }

  function processError() {
    applyButton.classList.remove('btn-primary');
    applyButton.classList.add('btn-danger');
    applyButton.classList.add('disabled');
  }

  inputCheck();
});

/* Lost focus during retraction mouse. */
applyButton.addEventListener('mouseout', function() {
  this.blur();
});