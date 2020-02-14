'use strict';

class Regex {
  constructor(expression = undefined) {
    this.expression = expression;
  }

  execute(str) {
    let result = [];

    let tmp;
    while ((tmp = this.expression.exec(str)) !== null) {
      if (tmp.index === this.expression.lastIndex) {
        this.expression.lastIndex++;
      }

      tmp.forEach((match, groupIndex) => {
        result.push({
          groupIndex: groupIndex,
          value: match
        });
      });
    }

    return result;
  }

  // Only words.
  owords(str) {
    if (typeof this.expression == 'undefined') {
      this.expression = /[a-zA-Z]\w+/gm;
    }
    return this.execute(str);
  }
}

class OccurrenceFinder {
  constructor(text) {
    this.regex = new Regex();
    this.text = text;
  }

  find() {
    let words = this.regex.owords(this.text);
    let result = {};
    words.forEach(function(i) {
      let lowerValue = i.value.toLowerCase();
      result[lowerValue] = (result[lowerValue] || 0) + 1;
    });
    return result;
  }
}

function test() {
  let text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Risus ultricies tristique nulla aliquet enim tortor at auctor urna. Fringilla ut morbi tincidunt augue interdum velit. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Lacinia quis vel eros donec ac. Odio facilisis mauris sit amet massa vitae tortor. Est placerat in egestas erat imperdiet sed. Diam maecenas sed enim ut sem viverra. Vitae sapien pellentesque habitant morbi tristique senectus et. Sem fringilla ut morbi tincidunt augue interdum velit euismod. Sit amet dictum sit amet justo. Interdum velit laoreet id donec ultrices. Lectus magna fringilla urna porttitor rhoncus dolor purus non. Consectetur lorem donec massa sapien faucibus et molestie ac feugiat. Tristique risus nec feugiat in fermentum posuere urna nec. Nibh nisl condimentum id venenatis a condimentum. In arcu cursus euismod quis viverra nibh cras pulvinar. Duis convallis convallis tellus id interdum velit laoreet id donec. Elementum curabitur vitae nunc sed velit. Felis eget velit aliquet sagittis id consectetur. Aliquam sem et tortor consequat id. Tincidunt augue interdum velit euismod in pellentesque massa placerat. Vulputate mi sit amet mauris. Pellentesque habitant morbi tristique senectus et netus et malesuada. Nibh mauris cursus mattis molestie a. Parturient montes nascetur ridiculus mus mauris vitae ultricies. Gravida in fermentum et sollicitudin ac orci. Pellentesque adipiscing commodo elit at imperdiet dui accumsan sit. At erat pellentesque adipiscing commodo elit at imperdiet dui. Cursus mattis molestie a iaculis at erat pellentesque. Purus in mollis nunc sed. Sit amet dictum sit amet justo. Adipiscing enim eu turpis egestas pretium aenean pharetra. Lorem donec massa sapien faucibus et molestie ac. Consequat nisl vel pretium lectus. Amet commodo nulla facilisi nullam vehicula. Ullamcorper a lacus vestibulum sed arcu non odio euismod lacinia. Ultrices eros in cursus turpis massa tincidunt dui ut ornare. Massa eget egestas purus viverra accumsan. Ultrices gravida dictum fusce ut. Elementum nisi quis eleifend quam. Consectetur purus ut faucibus pulvinar elementum. Sapien eget mi proin sed libero enim sed faucibus turpis. Nibh tellus molestie nunc non blandit massa enim nec dui. Orci nulla pellentesque dignissim enim sit amet. Amet dictum sit amet justo donec. Id consectetur purus ut faucibus pulvinar elementum integer. Ultrices in iaculis nunc sed augue lacus viverra vitae. Mi sit amet mauris commodo quis imperdiet massa. Sit amet risus nullam eget felis eget nunc. Eget gravida cum sociis natoque penatibus et magnis dis. Ullamcorper dignissim cras tincidunt lobortis. Ultrices eros in cursus turpis massa tincidunt dui ut. Maecenas ultricies mi eget mauris pharetra et ultrices. In fermentum et sollicitudin ac orci phasellus egestas. Vitae tempus quam pellentesque nec nam aliquam sem. Rutrum tellus pellentesque eu tincidunt. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo. Ipsum dolor sit amet consectetur adipiscing elit ut. Venenatis a condimentum vitae sapien pellentesque habitant morbi. Amet justo donec enim diam vulputate ut pharetra sit amet. Massa id neque aliquam vestibulum morbi blandit cursus risus at.';
  let occurrenceFinder = new OccurrenceFinder(text);
  document.querySelector('#testable-text').innerHTML = text;

  let occurrences = document.querySelector('.occurrences');
  Object.entries(occurrenceFinder.find()).forEach(e => {
    let element = document.createElement('p');
    element.innerHTML = `${e[0]} -> ${e[1]}`;
    occurrences.appendChild(element);
  });
}

test();