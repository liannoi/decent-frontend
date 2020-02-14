'use strict';

const DEFAULT_PERCENT = 5;

class ProgressBar {
  constructor(bar, button) {
    this.bar = bar;
    this.button = button;

    let inner = document.createElement('div');
    inner.style.width = '0';
    inner.style.height = '100%';
    inner.style.backgroundColor = '#398A8A';
    inner.style.borderRadius = '3px';
    this.bar.appendChild(inner);
    this.button.addEventListener('click', () => this.increase());
  }

  increase() {
    let childWidth = this.bar.firstElementChild.style.width.split('px')[0];
    let childWidthEqualsBar = childWidth ==
        this.bar.style.width.split('px')[0];
    let childWidthEqualsArea = childWidth ==
        this.bar.parentElement.offsetWidth;
    if (childWidthEqualsBar || childWidthEqualsArea) {
      return;
    }

    this.bar.firstElementChild.style.width = `${+childWidth +
    DEFAULT_PERCENT}px`;
  }
}

let progressBar = new ProgressBar(document.querySelector('.area .progress-bar'),
    document.querySelector('.area button'));