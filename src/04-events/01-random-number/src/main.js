'use strict';

class RandomValue {
  value;

  constructor(range) {
    this.value = 0;
    this.range = range;
  }

  generate() {
    let min = Math.ceil(this.range.min);
    this.value = Math.floor(
        Math.random() * (Math.floor(this.range.max) - min + 1)) + min;
  }
}

let randomValue = new RandomValue({
  min: 0,
  max: 100,
});

document.querySelector('.random-generate-button').
    addEventListener('click', function() {
      randomValue.generate();
      document.querySelector('.random-value').innerHTML = randomValue.value;
    });