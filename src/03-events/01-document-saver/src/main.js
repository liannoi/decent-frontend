'use strict';

let maxDepth = 4;

class CodeController {
  isWorked;

  constructor(expectedCombination) {
    this.depth = 0;
    this.code = '';
    this.expectedCombination = expectedCombination;
  }

  codeReceived(code) {
    this.code += code;
    this.depth += 1;
  }

  shouldBeClear() {
    return this.depth === maxDepth;
  }

  clear() {
    this.depth = 0;
    this.code = '';
    this.isWorked = false;
  }

  checkCombination() {
    if (this.code === this.expectedCombination) {
      this.isWorked = true;
      return true;
    }
    return false;
  }

  clearIfNeed() {
    if (this.shouldBeClear()) {
      this.clear();
    }
  }
}

class DocumentSaver {
  constructor(listener) {
    this.listener = listener;
    this.listener.addEventListener('keydown', (event) => {
      event.preventDefault();
      this.listenCtrlShiftS(event);
      this.listenCtrlA(event);
      this.listenCtrlS(event);
    });
    this.ctrlShiftSController = new CodeController(
        'AltLeftControlLeftShiftLeftKeyS');
    this.ctrlAController = new CodeController('AltLeftControlLeftKeyA');
    this.ctrlSController = new CodeController('AltLeftControlLeftKeyS');
  }

  checkAlt(event, controller) {
    if (controller.depth > 0) {
      return true;
    }
    return event.code === 'AltLeft' && controller.depth === 0;
  }

  listenCtrlS(event) {
    if (event === undefined) {
      return;
    }
    if (!this.checkAlt(event, this.ctrlSController)) {
      return;
    }

    this.ctrlSController.codeReceived(event.code);
    if (this.ctrlSController.checkCombination()) {
      alert('Saved');
    }

    document.querySelector(
        '#status').innerHTML = `STATUS: ${this.ctrlSController.code}`;

    this.ctrlSController.clearIfNeed();
  }

  listenCtrlA(event) {
    if (event === undefined) {
      return;
    }
    if (!this.checkAlt(event, this.ctrlAController)) {
      return;
    }

    this.ctrlAController.codeReceived(event.code);
    if (this.ctrlAController.checkCombination()) {
      alert('All selected');
    }

    document.querySelector(
        '#status').innerHTML = `STATUS: ${this.ctrlAController.code}`;

    this.ctrlAController.clearIfNeed();
  }

  listenCtrlShiftS(event) {
    if (event === undefined) {
      return;
    }
    if (!this.checkAlt(event, this.ctrlShiftSController)) {
      return;
    }

    this.ctrlShiftSController.codeReceived(event.code);
    if (this.ctrlShiftSController.checkCombination()) {
      alert('All saved');
    }

    document.querySelector(
        '#status').innerHTML = `STATUS: ${this.ctrlShiftSController.code}`;

    this.ctrlShiftSController.clearIfNeed();
  }
}

let documentSaver = new DocumentSaver(document.querySelector('body'));
documentSaver.listenCtrlShiftS();
documentSaver.listenCtrlA();
documentSaver.listenCtrlS();