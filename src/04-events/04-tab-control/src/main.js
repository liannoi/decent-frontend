'use strict';

class TabControl {
  constructor(selector, tabs) {
    this.selector = selector;
    this.tabs = tabs;
  }

  get allTabs() {
    return this.tabs.querySelectorAll('.tc-tab');
  }

  get allContents() {
    return document.querySelectorAll('.tc-content');
  }

  setTabsHeight() {
    this.tabs.style.height = `${this.selector.offsetHeight}px`;
  }

  select(tabId) {
    this.deselectAll();

    this.allTabs.forEach(e => {
      if (e.getAttribute('id') === tabId) {
        e.style.backgroundColor = '#4873A1';
      }
    });

    this.allContents.forEach(
        e => {
          if (e.getAttribute('id') === `for-${tabId}`) {
            this.selector = e;
            this.selector.style.display = 'flex';
          }
        });

    this.setTabsHeight();
  }

  deselectAll() {
    this.allTabs.forEach(e => {
      e.style.backgroundColor = '#597BA0';
    });

    this.allContents.forEach(e => e.style.display = 'none');
  }
}

let tabControl = new TabControl(document.querySelector('.tc-content'),
    document.querySelector('.tc-tabs'));
tabControl.select(tabControl.allTabs[0].getAttribute('id'));

document.querySelectorAll('.tc-tab').forEach(e => {
  e.addEventListener('click',
      function() {
        tabControl.select(this.getAttribute('id'));
      });
});