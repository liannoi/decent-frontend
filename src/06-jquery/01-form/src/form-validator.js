'use strict';

class ValidationErrorMessage {
  constructor(message, place, parent) {
    this.message = message;
    this.place = place;
    this.parent = parent;
  }

  print() {
    this.parent.classList.remove('d-none');
    this.place.innerHTML = this.message;
  }

  hide() {
    this.parent.classList.add('d-none');
  }
}

class FormValidator {
  constructor(inputs) {
    this.validationErrorMessage = new ValidationErrorMessage(undefined,
        document.querySelector('#validation-error-message'),
        document.querySelector('#validation-error'));
    this.inputs = inputs;
  }

  print(message) {
    this.validationErrorMessage.message = message;
    this.validationErrorMessage.print();
  }

  success(item) {
    item.classList.add('is-valid');
    item.classList.remove('is-invalid');
  }

  unsuccessfully(item) {
    item.classList.remove('is-valid');
    item.classList.add('is-invalid');
  }

  validationSuccess(items) {
    this.hideError();
    items.forEach(e => {
      e.classList.add('is-valid');
      e.classList.remove('is-invalid');
    });
  }

  hideError() {
    this.validationErrorMessage.hide();
  }

  // Check empty fields.
  cefields() {
    let shouldContinue = false;

    // Decide whether to display an error message.
    for (const input of this.inputs) {
      if (input.value.length === 0) {
        shouldContinue = true;
        this.print('Empty fields.');
        break;
      }
    }

    // All is well, the fields are not empty.
    if (!shouldContinue) {
      this.validationSuccess(this.inputs);
      return false;
    }

    // "Paint".
    this.inputs.forEach(e => {
      if (e.value.length === 0) {
        this.unsuccessfully(e);
      } else {
        this.success(e);
      }
    });

    return true;
  }

  // Check gender radios.
  cgradios(selector) {
    let haveSelected = false;

    // Did you choose at least one gender.
    for (let radio of document.querySelectorAll(selector)) {
      if (radio.checked) {
        haveSelected = true;
        break;
      }
    }

    // All is well, gender is selected.
    if (haveSelected) {
      this.hideError();
      return false;
    }

    // Error message.
    this.print('Choose your gender.');
    return true;
  }

  // Check passwords match.
  cpmatch(selector) {
    let passwords = document.querySelectorAll(selector);

    // Passwords match.
    if (passwords[0].value === passwords[1].value) {
      this.validationSuccess(passwords);
      return false;
    }

    // Error message.
    this.print('Passwords entered do not match.');
    passwords.forEach(e => {
      this.unsuccessfully(e);
    });
    return true;
  }

  // Email format check.
  cfemail(selector) {
    let email = document.querySelector(selector);

    // Email in the correct format.
    //
    // Checking for a domain name (haveDomain) is performed according to the
    // following algorithm: if nothing is found after the dog symbol,
    // immediately false. Then it will be true only if the domain name is not
    // empty (there is not only a dog’s symbol), the domain name contains a
    // period and after the period there are symbols.
    let containsDog = email.value.includes('@'),
        nearAvgLength = email.value.length >= 5,
        haveDomain = (typeof email.value.split('@')[1] != 'undefined') ? email.value.split('@')[1].length !== 0 &&
            email.value.split('@')[1].includes('.') &&
            email.value.split('@')[1].split('.')[1].length !== 0 : false;
    if (containsDog && nearAvgLength && haveDomain) {
      this.hideError();
      this.success(email);
      return false;
    }

    // Error message.
    this.print('Email specified in incorrect format.');
    this.unsuccessfully(email);
    return true;
  }

  // Checking the entered delivery address.
  cdaddress(selector) {
    let deliveryAddress = document.querySelector(selector);

    let lengthMore10 = deliveryAddress.value.length >= 10;
    if (lengthMore10) {
      this.hideError();
      this.success(deliveryAddress);
      return false;
    }

    this.print('The delivery address you entered is incorrect.');
    this.unsuccessfully(deliveryAddress);
    return true;
  }

  // Check phone format.
  cfphone(selector) {
    let phone = document.querySelector(selector);

    let threeSeparators = phone.value.split('-').length === 3;
    let tenNumbers = phone.value.length === 10 + 3 - 1;
    if (threeSeparators && tenNumbers) {
      this.hideError();
      this.success(phone);
      return false;
    }

    this.print('Phone set in the wrong format');
    this.unsuccessfully(phone);
    return true;
  }

  cfname(selector) {
    let names = document.querySelectorAll(selector);
    let canContinue = true;
    for (const name of names) {
      if (name.value.length < 2 || /[^a-zA-Z\s:]/gm.test(name.value)) {
        canContinue = false;
        break;
      }
    }

    if (canContinue) {
      this.hideError();
      this.validationSuccess(names);
      return false;
    }

    this.print('The name is in the wrong format');
    names.forEach(e => {
      this.unsuccessfully(e);
    });
    return true;
  }
}