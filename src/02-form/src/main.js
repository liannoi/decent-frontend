'use strict';

class BootstrapFormValidator {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  isEmpty() {
    return this.username.value === '' && this.password.value === '';
  }

  validate(correctData) {
    this.makeIncorrect(this.username);
    this.makeIncorrect(this.password);

    const firstCondition = this.username.value === correctData.username;
    const secondCondition = +this.password.value === +correctData.password;

    if (firstCondition) {
      this.makeCorrect(this.username);
    }
    if (secondCondition) {
      this.makeCorrect(this.password);
    }

    return firstCondition && secondCondition;
  }

  makeCorrect(property) {
    property.classList.remove('is-invalid');
    property.classList.add('is-valid');
  }

  makeIncorrect(property) {
    property.classList.add('is-invalid');
    property.classList.remove('is-valid');
  }
}

let validator = new BootstrapFormValidator(
    document.querySelector('#user_name'),
    document.querySelector('#user_password'));

function getAlertMessage() {
  return document.querySelector('#empty-fields-message');
}

function getAlertMessageInput() {
  return document.querySelector('#message-alert');
}

function showAlertMessage() {
  getAlertMessage().classList.remove('d-none');
}

function hideAlertMessage() {
  getAlertMessage().classList.add('d-none');
}

function processEmptyFields() {
  showAlertMessage();
  getAlertMessageInput().classList.remove('alert-success');
  getAlertMessageInput().classList.add('alert-danger');
  getAlertMessageInput().innerHTML = 'You did not fill in the username and password.';
  validator.makeIncorrect(validator.username);
  validator.makeIncorrect(validator.password);
}

function processComplete() {
  showAlertMessage();
  getAlertMessageInput().classList.remove('alert-danger');
  getAlertMessageInput().classList.add('alert-success');
  getAlertMessageInput().innerHTML = 'You can be logged in successfully.';
}

document.querySelector('#submit-button').onclick = function() {
  if (validator.isEmpty()) {
    processEmptyFields();
    return false;
  } else {
    hideAlertMessage();
  }

  if (validator.validate({
    username: 'admin',
    password: 12345,
  })) {
    processComplete();
  }

  return false;
};