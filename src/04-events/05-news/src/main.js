'use strict';

class NewsRemover {
  constructor(buttons) {
    this.buttons = buttons;
    this.buttons.forEach(e => e.addEventListener('click', () =>
        e.parentElement.remove(),
    ));
  }
}

let newsRemover = new NewsRemover(document.querySelectorAll('.news button'));