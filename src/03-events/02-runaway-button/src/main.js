'use strict';

class ButtonDraggable {
  delta;

  constructor(selector) {
    this.button = document.querySelector(selector);
    this.button.addEventListener('mousedown', () => this.move());
  }

  move() {
    this.delta = {
      x: Math.round(Math.random() * 14) - this.button.offsetLeft,
      y: Math.round(Math.random() * 41) - this.button.offsetTop,
    };
    const self = this;
    this.button.addEventListener('mouseover', (event) => {
      let isEvenNumber = Math.round(Math.random() * 14) % 2 === 0;
      self.button.style.left = `${(isEvenNumber)
          ? event.clientX - self.delta.x
          : event.clientX + self.delta.x}px`;
      self.button.style.top = `${(isEvenNumber)
          ? event.clientY - self.delta.y
          : event.clientY + self.delta.y}px`;
    });
  }
}

let buttonDraggable = new ButtonDraggable('.draggable-button');

window.addEventListener('load', () => {
  buttonDraggable.move();
});