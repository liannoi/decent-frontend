'use strict';

class CanvasDrawer {
  constructor(canvas) {
    this.canvas = canvas;
  }

  get canvasContext() {
    return this.canvas.getContext('2d');
  }

  draw(image) {
    this.canvasContext.drawImage(image, 0, 0, this.canvas.width,
        this.canvas.height);
  }
}

function test() {
  let canvasDrawer = new CanvasDrawer(
      document.querySelector('#carousel-canvas'));
  document.querySelectorAll('.carousel-item').
      forEach(e => e.addEventListener('click', function() {
        canvasDrawer.draw(this.childNodes[0]);
      }));
}

test();