'use strict';

function test() {
  function checkValidity(element) {
    if (element.checkValidity()) {
      element.classList.remove('is-invalid');
      element.classList.add('is-valid');
    } else {
      element.classList.remove('is-valid');
      element.classList.add('is-invalid');
    }
  }

  document.querySelectorAll('input').forEach(e => {
    e.addEventListener('keyup', function() {
      checkValidity(this);
    });
  });
}

test();