'use strict';

class BaseDataSaver {
  constructor(item) {
    this.item = item;
  }

  read() {}

  save() {}

  readOrSave() {}

  remove() {}
}

class CookiesDataSaver extends BaseDataSaver {
  constructor(item) {
    super(item);
  }

  read() {
    let result = document.cookie.match(
        '(^|;)\\s*' + this.item.name + '\\s*=\\s*([^;]+)');
    return result ? result.pop() : '';
  }

  save() {
    document.cookie = `${this.item.name}=${this.item.value}; expires=${this.item.expires.utc};`;
  }

  readOrSave() {
    const self = this;

    function createCookie() {
      self.save({
        name: self.item.name,
        value: self.item.value,
        expires: self.item.expires.utc,
      });
    }

    let cookiesNotFound = this.read(this.item.name) === '';
    if (cookiesNotFound) {
      createCookie();
    }

    return this.read(this.item.name);
  }

  remove() {
    document.cookie = `${this.item.name}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  }
}

class LocalStorageDataSaver extends BaseDataSaver {
  constructor(item) {
    super(item);
  }

  read() {
    return window.localStorage[this.item.name];
  }

  save() {
    window.localStorage[this.item.name] = this.item.value;
  }

  readOrSave() {
    let readed = this.read(this.item.name);
    if (readed) {
      return readed;
    }

    this.save(this.item.name, this.item.value);
    return this.read(this.item.name);
  }
}

class Expires {
  constructor() {
    this.date = new Date();
  }

  get utc() {
    return this.date.toUTCString();
  }

  toMonth() {
    this.date.setMonth(this.date.getMonth() + 1);
  }
}

class DataSaver {
  constructor(baseDataSaver) {
    this.baseDataSaver = baseDataSaver;
  }

  fromStorage() {
    return this.baseDataSaver.read();
  }

  fromStorageOrNew() {
    return this.baseDataSaver.readOrSave();
  }
}