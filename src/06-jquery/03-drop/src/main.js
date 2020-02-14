'use strict';

class Draggable {
  constructor(selector, endPoint) {
    this.selector = selector;
    this.endPoint = endPoint;
  }

  get selectorParent() {
    return this.selector.parent();
  }

  cursorGrab(element) {
    if (arguments.length === 0) {
      element = this.selector;
    }

    element.css('cursor', 'grab');
  }

  subscribeElements() {
    const self = this;
    let isMouseDown = true;

    // You can "take".
    this.selectorParent.mouseenter(function() {
      self.cursorGrab();
    });

    // Moving.
    this.selectorParent.mousedown(function() {
      isMouseDown = true;
      self.selector.css('cursor', 'grabbing');

      // Go to the zone where you can "throw".
      self.endPoint.mouseenter(function() {
        if (!isMouseDown) {
          return;
        }
        self.selectorParent.parent().css({
          'background-image': 'linear-gradient( 135deg, #ABDCFF 10%, #0396FF 100%)',
          'opacity': '0.5',
          'color': '#FFFFFF',
          'border': 'none',
        }).animate({
          'opacity': '1',
        }, 4000);
        self.selectorParent.html(
            '<div class="block-content drag"><div class="text"><span style="margin: -20px;">Successfully!</span></div></div>');
      });

      return false;
    });

    // Mouse released.
    this.selectorParent.mouseup(function() {
      self.cursorGrab();
      isMouseDown = false;
    });
  }
}

let draggable = new Draggable($('.drag'), $('.drop-zone .block-content'));
draggable.subscribeElements();