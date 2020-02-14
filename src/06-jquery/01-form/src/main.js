'use strict';

function validateForm() {
  function validate(submitButton, formValidator) {
    submitButton.blur();
    if (formValidator.cefields()) {
      return false;
    }

    return true;
  }

  let inputs = document.querySelectorAll('.checkable-input');
  let formValidator = new FormValidator(inputs);
  let submitButton = $('#submit-button')[0];
  submitButton.addEventListener('click', event => {
    event.preventDefault();

    inputs.forEach(e => e.addEventListener('keyup', () => validate(submitButton, formValidator)));
    if (!validate(submitButton, formValidator)) {
      return false;
    }

    $('#form')[0].submit();
  });
}

validateForm();