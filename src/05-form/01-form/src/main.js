'use strict';

let inputs = document.querySelectorAll('.checkable-input');
let radios = document.querySelectorAll('.selectable-input');

let formValidator = new FormValidator(inputs);

let submitButton = document.querySelector('#submit-button');
submitButton.addEventListener('click', () => {
  // Validation more often does not force the user to constantly click the
  // check (registration) button. At the same time, we do not start to paint
  // everything at the moment of opening the page, but only after the first
  // registration attempt.
  inputs.forEach(e => e.addEventListener('keyup', () => validate()));
  radios.forEach(e => e.addEventListener('click', () => validate()));

  validate();

  // There is no need to send data to the server. We want to see what will
  // happen as a result of the correct answers.
  return false;
});

function validate() {
  // We remove the focus from the button.
  submitButton.blur();

  // Step-by-step validation, without wasting resource time, by means of
  // sufficiently optimal verification cycles. Return indicates that the check
  // failed and there is no point in continuing.
  if (formValidator.cefields()) {
    return;
  }
  if (formValidator.cpmatch('input[type=\'password\']')) {
    return;
  }
  if (formValidator.cfemail('input[type=\'email\']')) {
    return;
  }
  if (formValidator.cgradios('input[name=\'user[gender]\']')) {
    return;
  }
}