'use strict';

class TextEditor {
  constructor() {
    this.isSaved = true;
  }

  close() {
    if (this.isSaved) {
      window.removeEventListener('beforeunload', getListener);
      return true;
    }

    return false;
  }
}

let textEditor = new TextEditor();

window.addEventListener('change', () => textEditor.isSaved = false);

document.querySelector('.btn-save').
    addEventListener('click', () => textEditor.isSaved = true);

document.querySelector('#text_area').addEventListener('mouseout', function() {
  this.blur();
});

window.addEventListener('beforeunload', getListener());

function getListener() {
  return function(event) {
    if (textEditor.close()) {
      return;
    }

    event.preventDefault();
    event.returnValue = '';
  };
}