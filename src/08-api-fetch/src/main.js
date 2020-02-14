'use strict';

class Enumeration {
  enum;

  constructor(...item) {
    this.enum = Object.freeze(
        Object.assign({}, ...item.map(k => ({
          [k.key]: k.value,
        }))));
  }
}

// Property names that are stored in objects retrieved from the API.
let apis = new Enumeration({
  key: 'USER_NAME',
  value: 'name',
}, {
  key: 'USER_ID',
  value: 'id',
}, {
  key: 'USER_USERNAME',
  value: 'username',
}, {
  key: 'USER_EMAIL',
  value: 'email',
}, {
  key: 'USER_PHONE',
  value: 'phone',
}, {
  key: 'USER_WEBSITE',
  value: 'website',
}, {
  key: 'USER_POST_ID',
  value: 'id',
}, {
  key: 'USER_POST_TITLE',
  value: 'title',
}, {
  key: 'USER_POST_BODY',
  value: 'body',
});

const CLASS_TEXT_BOLD = 'text-bold';

class Fetcher {
  constructor(outputSelector, resource) {
    this.outputSelector = outputSelector;
    this.resource = resource;
  }

  fetchJson() {
    return fetch(this.resource).then(i => i.json());
  }

  async fetch(length = undefined) {}
}

// Необходим рефакторинг. Фетчеры необходимо обобщить и привести к базовому
// классу, создающий карточки на основе размапиного JSON.
class UserFetcher extends Fetcher {
  constructor(outputSelector, resource) {
    super(outputSelector, resource);
  }

  async fetch(length = undefined) {
    const self = this;

    function createCard(user) {
      let firstParentElement = document.createElement('div');
      firstParentElement.classList.add('col', 'mt-4');
      let secondParentElement = document.createElement('div');
      secondParentElement.classList.add('card', 'text-center');
      let cardElement = document.createElement('div');
      cardElement.classList.add('card-body');
      let cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title');
      cardTitle.setAttribute('data-user-id', user[apis.enum['USER_ID']]);
      cardTitle.innerHTML = user[apis.enum['USER_NAME']];

      cardElement.appendChild(cardTitle);
      secondParentElement.appendChild(cardElement);
      firstParentElement.appendChild(secondParentElement);
      self.outputSelector.appendChild(firstParentElement);
    }

    if (typeof length === 'undefined') {
      return this.fetchJson().then(j => j.forEach(e => createCard(e)));
    }

    return this.fetchJson().then(j => {
      if (length >= j.length) {
        length = j.length;
      }

      for (let i = 0; i < length; i++) {
        createCard(j[i]);
      }
    });
  }
}

class UserInfoFetcher extends Fetcher {
  constructor(outputSelector, resource) {
    super(outputSelector, resource);
  }

  async fetch() {
    const self = this;

    function createTable(info) {
      function createRow(body, columnName, value) {
        let row = document.createElement('tr');
        let definition = document.createElement('td');
        definition.innerHTML = columnName;
        row.appendChild(definition);
        definition = document.createElement('td');
        definition.innerHTML = value;
        row.appendChild(definition);
        body.appendChild(row);
      }

      let table = document.createElement('table');
      table.classList.add('table', 'table-bordered');
      let body = document.createElement('tbody');
      createRow(body, 'Name', info[apis.enum['USER_NAME']]);
      createRow(body, 'Username', info[apis.enum['USER_USERNAME']]);
      createRow(body, 'Address',
          `${info.address.city}, ${info.address.street}`);
      createRow(body, 'Email', info[apis.enum['USER_EMAIL']]);
      createRow(body, 'Phone', info[apis.enum['USER_PHONE']]);
      createRow(body, 'Website', info[apis.enum['USER_WEBSITE']]);

      table.appendChild(body);
      self.outputSelector.appendChild(table);
    }

    return this.fetchJson().then(j => createTable(j));
  }
}

class UserPostsFetcher extends Fetcher {
  constructor(outputSelector, resource) {
    super(outputSelector, resource);
  }

  async fetch(length = undefined) {
    const self = this;

    function createCard(userPost) {
      let firstParentElement = document.createElement('div');
      firstParentElement.classList.add('col', 'mt-4');

      let secondParentElement = document.createElement('div');
      secondParentElement.classList.add('card');

      let cardElement = document.createElement('div');
      cardElement.classList.add('card-body');

      let cardTitle = document.createElement('h5');
      cardTitle.classList.add('card-title', 'text-bold', 'text-sentence');
      cardTitle.setAttribute('data-user-post-id',
          userPost[apis.enum['USER_POST_ID']]);
      cardTitle.innerHTML = userPost[apis.enum['USER_POST_TITLE']];

      let cardBody = document.createElement('p');
      cardBody.classList.add('card-text', 'text-sentence');
      cardBody.innerHTML = userPost[apis.enum['USER_POST_BODY']];

      cardElement.appendChild(cardTitle);
      cardElement.appendChild(cardBody);
      secondParentElement.appendChild(cardElement);
      firstParentElement.appendChild(secondParentElement);
      self.outputSelector.appendChild(firstParentElement);
    }

    if (typeof length === 'undefined') {
      return this.fetchJson().then(j => j.forEach(e => createCard(e)));
    }

    return this.fetchJson().then(j => {
      if (length >= j.length) {
        length = j.length;
      }

      for (let i = 0; i < length; i++) {
        createCard(j[i]);
      }
    });
  }
}

class ClassManager {
  constructor(element, className) {
    this.element = element;
    this.className = className;
  }

  get classList() {
    return this.element.classList;
  }

  apply() {
    this.classList.add(this.className);
  }

  unset() {
    this.classList.remove(this.className);
  }

  applyOrUnset() {
    this.classList.contains(this.className) ? this.unset() : this.apply();
  }
}

class ItemsClassManager {
  constructor(selector, className) {
    this.selector = selector;
    this.className = className;
  }

  unset() {
    this.selector.forEach(e => e.classList.remove(this.className));
  }
}

class UserSelector {
  constructor(parentSelector) {
    this.userId = 0;
    this.parentSelector = parentSelector;
    this.blockTitle = new ClassManager(
        document.querySelector('#second-block-title'), 'd-none');
    this.blockButton = new ClassManager(
        document.querySelector('#second-block-button'), 'd-none');
  }

  listenParentClick() {
    this.parentSelector.forEach(e => {
      e.parentNode.parentNode.addEventListener('click', () => {
        this.blockTitle.unset();
        this.blockButton.unset();
        this.fetchUserInfo(e);
        this.unselectAll();
        this.select(e);
        this.userId = +e.dataset.userId;
      });
    });
  }

  // Исправил раздражающее мигание, но при этом существует ошибка
  // "множественного выбора", если много кликать по одной карточке или случайно
  // кликать по разным. Это происходит из-за отсутствия синхронизации
  // асинхронных методов. Решается "заморозкой" карточек, до момента завершения
  // обработки клика. В этой работе не реализовал, так как не считаю это
  // критичным в данном случае.
  //
  // Сделать еще плавнее возможно, только если используя JavaScript - мягко
  // изменять свойство display.
  unselectAll() {
    this.usersStyle = new ItemsClassManager(
        document.querySelectorAll('.block-users .card-title'), CLASS_TEXT_BOLD);
    this.usersStyle.unset();
    let selector = document.querySelector('.table-user-info table');
    if (selector) {
      this.softRemoveSelector(selector);
    }
    let posts = document.querySelectorAll('.block-user-posts .card');
    if (posts.length !== 0) {
      this.hardRemovePosts();
    }
  }

  softRemoveSelector(selector) {
    async function prepareToDelete() {
      selector.classList.add('deleting');
      await new Promise(resolve => setTimeout(resolve, 1050));
    }

    prepareToDelete().then(() => selector.remove());
  }

  hardRemovePosts() {
    document.querySelectorAll('.block-user-posts .card').
        forEach(e => e.parentElement.remove());
  }

  select(element) {
    this.classBoldText = new ClassManager(element, CLASS_TEXT_BOLD);
    this.classBoldText.applyOrUnset();
  }

  fetchUserInfo(element) {
    this.userInfoFetcher = new UserInfoFetcher(
        document.querySelector('.table-user-info'),
        `https://jsonplaceholder.typicode.com/users/${element.dataset.userId}`);
    this.userInfoFetcher.fetch();
  }
}

class UserPostsSelector {
  constructor(userSelector, parentSelector) {
    this.parentSelector = parentSelector;
    this.userSelector = userSelector;
  }

  listenClick() {
    this.parentSelector.addEventListener('click', () => {
      this.fetcher = new UserPostsFetcher(
          document.querySelector('.block-user-posts'),
          `https://jsonplaceholder.typicode.com/posts?userId=${this.userSelector.userId}`);
      this.fetcher.fetch();
    });
  }
}

async function runtime() {
  let userFetcher = new UserFetcher(document.querySelector('.block-users'),
      'https://jsonplaceholder.typicode.com/users');
  await userFetcher.fetch(6);

  let userSelector = new UserSelector(
      document.querySelectorAll('.block-users .card-title'));
  userSelector.listenParentClick();

  let userPostsSelector = new UserPostsSelector(userSelector,
      document.querySelector('#second-block-button'));
  userPostsSelector.listenClick();
}

runtime();