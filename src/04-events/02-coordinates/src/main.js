'use strict';

class MouseMoveFixer {
  constructor(selector) {
    this.selector = selector;
    window.addEventListener('mousemove', (event) => {
      this.selector.innerHTML = `X = ${event.clientX}, Y = ${event.clientY}`;
    });
    this.selector.addEventListener('click', () => alert('Left Click'));
    this.selector.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      alert('Right Click');
    });
  }
}

let mouseMoveFixer = new MouseMoveFixer(document.querySelector('.title'));