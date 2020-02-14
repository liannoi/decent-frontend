'use strict';

class TextHider {
  constructor(parentSelector) {
    this.isVisible = true;
    this.parentSelector = parentSelector;
  }

  display(style) {
    this.parentSelector.querySelectorAll('p').
        forEach(e => e.style.display = style);
  }

  hide() {
    this.display('none');
    this.isVisible = false;
  }

  show() {
    this.display('block');
    this.isVisible = true;
  }
}

class ButtonTextHider extends TextHider {
  constructor(parentSelector) {
    super(parentSelector);
  }

  hideOrShow() {
    this.isVisible ? this.hide() : this.show();
  }
}

let textHider = new ButtonTextHider(document.querySelector('.text-collapse'));
document.querySelector('.collapse-button').
    addEventListener('click', () => textHider.hideOrShow());