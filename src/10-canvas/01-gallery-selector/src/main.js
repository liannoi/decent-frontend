'use strict';

class CanvasImage {
  constructor(images, canvas) {
    this.images = images;
    this.canvas = canvas;
  }

  get canvasContext() {
    return this.canvas.getContext('2d');
  }

  draw(index) {
    this.currentIndex = index;
    this.canvasContext.drawImage(this.images[index], 0, 0, this.canvas.width,
        this.canvas.height);
  }

  drawNext() {
    let index = ++this.currentIndex;
    if (index >= this.images.length) {
      index = 0;
    }
    this.draw(index);
  }

  drawPrevious() {
    let index = --this.currentIndex;
    if (index < 0) {
      index = this.images.length - 1;
    }
    this.draw(index);
  }

  initial() {
    this.draw(0);
  }
}

class GalleryButtons {
  constructor(canvasImage, selector) {
    this.canvasImage = canvasImage;
    this.selector = selector;
  }

  get nextButton() {
    return this.selector[this.selector.length - 1];
  }

  get previousButton() {
    return this.selector[0];
  }

  get initialButton() {
    return this.selector[1];
  }

  moveNext() {
    const self = this;
    this.nextButton.addEventListener('click', () => {
      self.nextButton.blur();
      self.canvasImage.drawNext();
    });
  }

  moveBack() {
    const self = this;
    this.previousButton.addEventListener('click', () => {
      self.previousButton.blur();
      self.canvasImage.drawPrevious();
    });
  }

  prepareInitial() {
    const self = this;
    this.initialButton.addEventListener('click', () => {
      self.initialButton.blur();
      self.canvasImage.initial();
    });
  }
}

function test() {
  let canvasImage = new CanvasImage(document.querySelectorAll('.gallery img'),
      document.querySelector('.gallery #gallery-canvas'));
  canvasImage.initial();

  let galleryButtons = new GalleryButtons(canvasImage,
      document.querySelectorAll('.nav button'));
  galleryButtons.moveNext();
  galleryButtons.moveBack();
  galleryButtons.prepareInitial();
}

test();