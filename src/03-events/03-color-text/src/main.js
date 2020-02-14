'use strict';

// enum.
const COLORS = {
  RED: '#FF6961',
  BLUE: '#ADD8E6',
  GREEN: '#C0D890',
};

class ParagraphsStyler {
  constructor(items) {
    this.items = items;
  }

  colorize(hexCode) {
    this.items.forEach(e => e.style.color = hexCode);
  }
}

class KeyStyler extends ParagraphsStyler {
  constructor(items) {
    super(items);
  }

  bind() {
    window.addEventListener('keydown', (event) => {
      if (event.code === 'KeyR') {
        this.colorize(COLORS.RED);
      } else if (event.code === 'KeyG') {
        this.colorize(COLORS.GREEN);
      } else if (event.code === 'KeyB') {
        this.colorize(COLORS.BLUE);
      }
    });
  }
}

let paragraphsStyler = new KeyStyler(
    document.querySelectorAll('.text-block > p'));
paragraphsStyler.bind();