'use strict';

class DivMover {
  leftArrowClicked;

  constructor() {
    this.leftArrowClicked = this.leftArrowEvent;
  }

  get leftArrowEvent() {
    return new Event('leftArrowClicked');
  }

  get rightArrowEvent() {
    return new Event('rightArrowClicked');
  }

  subscribe(initiator, action) {
    document.addEventListener(initiator, action);
  }

  processArrows() {
    const self = this;
    $(document).keydown(function(event) {
      if (event.key === 'ArrowLeft') {
        document.dispatchEvent(self.leftArrowEvent);
      } else if (event.key === 'ArrowRight') {
        document.dispatchEvent(self.rightArrowEvent);
      }
    });
  }
}

const MOVE_STEP = 100;

let divMover = new DivMover();
divMover.subscribe('leftArrowClicked', function() {
  let item = $('.block');
  let style = item.css('margin-left');
  item.css('margin-left', style).animate({
    'margin-left': `${style.split('px')[0] - MOVE_STEP}px`,
  });
});
divMover.subscribe('rightArrowClicked', function() {
  let item = $('.block');
  let style = item.css('margin-left');
  item.css('margin-left', style).animate({
    'margin-left': `${+style.split('px')[0] + MOVE_STEP}px`,
  });
});
divMover.processArrows();