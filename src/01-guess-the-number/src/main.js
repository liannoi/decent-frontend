'use strict';

class DotAnimation {
  constructor(selector, dots, repetitions, interval, onNumberPicked) {
    this.selector = selector;
    this.defaultMessage = this.selector.innerHTML;
    this.dots = ++dots;
    this.repetitions = repetitions;
    this.interval = interval;
    this.selector.addEventListener('number-picked', onNumberPicked);
  }

  animate() {
    let enterCounter = 0,
        drawCounter = 0;
    let animation = setInterval(move, this.interval);
    const self = this;

    function move() {
      if (++enterCounter === self.dots * self.repetitions) {
        clearInterval(animation);
        self.selector.dispatchEvent(new Event('number-picked'));
        return;
      }
      self.selector.innerHTML += '.';
      if (++drawCounter === self.dots) {
        self.selector.innerHTML = self.defaultMessage;
        drawCounter = 0;
      }
    }
  }
}

function selectParagraph() {
  return document.querySelector('#makes-number');
}

function selectResultLabel() {
  return document.querySelector('#message-enter-value');
}

function selectMessageResult() {
  return document.querySelector('#message-result');
}

function selectUserValue() {
  return document.querySelector('#user_value').value;
}

function makesNumber() {
  let dotAnimation = new DotAnimation(selectParagraph(),
      3, 3, 250, () => suggestEnterNumber());
  dotAnimation.animate();
}

function suggestEnterNumber() {
  selectParagraph().parentNode.parentElement.classList.add('hidden');
  selectResultLabel().
      parentNode.
      parentNode.
      parentNode.
      parentNode.
      parentElement.
      classList.
      remove('hidden');
  selectResultLabel().innerHTML = 'The number is conceived, try to guess';
}

class Comparer {
  constructor(firstValue, secondValue, initialString) {
    this.firstValue = firstValue;
    this.secondValue = secondValue;
    this.initialString = initialString;
  }

  compare() {
    if (this.firstValue > this.secondValue) {
      this.initialString += 'greater than the intended value ';
    } else if (this.secondValue > this.firstValue) {
      this.initialString += 'less than the intended value ';
    } else {
      this.initialString += 'intended ';
    }
    this.initialString += `(${this.secondValue})`;
  }
}

function checkValue() {
  let randomValue = Math.round(Math.random() * 44);

  document.querySelector('#check-button').onclick = function() {
    function hide() {
      document.querySelector('#form').
          parentNode.
          parentElement.
          classList.
          add('hidden');
      selectMessageResult().parentNode.parentElement.classList.remove('hidden');
    }

    hide();

    let comparer = new Comparer(selectUserValue(), randomValue,
        `The value you specified (${selectUserValue()}) is `);
    comparer.compare();
    selectMessageResult().innerHTML = comparer.initialString;

    return false;
  };
}

makesNumber();
checkValue();