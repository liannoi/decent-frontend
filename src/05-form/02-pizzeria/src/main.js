'use strict';

/* Constants, values can be obtained, for example, from a database. */

const CLIENT_ID = 1;
const INGREDIENTS_LIMIT = 5;
const PRICE_PER_UNIT_SMALL_CAKE = 5;
const PRICE_PER_UNIT_MEDIUM_CAKE = 10;
const PRICE_PER_UNIT_LARGE_CAKE = 15;
const PRICE_PER_UNIT_MUSHROOMS = 10.24;
const PRICE_PER_UNIT_BACON = 2;
const PRICE_PER_UNIT_TOMATOES = 2;
const PRICE_PER_UNIT_CHEESE = 3;
const PRICE_PER_UNIT_OLIVES = 4;

/* Classes. */

class BaseObject {
  constructor(pricePerUnit) {
    this.pricePerUnit = pricePerUnit;
  }
}

class Cake extends BaseObject {
  constructor(pricePerUnit) {
    super(pricePerUnit);
  }
}

class SmallCake extends Cake {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Small Cake';
  }
}

class MediumCake extends Cake {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Medium Cake';
  }
}

class LargeCake extends Cake {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Large Cake';
  }
}

class Mushroom extends BaseObject {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Mushroom';
  }
}

class Bacon extends BaseObject {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Bacon';
  }
}

class Tomato extends BaseObject {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Tomato';
  }
}

class Cheese extends BaseObject {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Cheese';
  }
}

class Olive extends BaseObject {
  constructor(pricePerUnit) {
    super(pricePerUnit);
    this.name = 'Olive';
  }
}

/* Pizza Designer. */
class Pizza {
  constructor(builder) {
    this.client = builder.client;
    this.cake = builder.cake;
    this.price = builder.price;
    this.mushrooms = builder.mushrooms;
    this.bacon = builder.bacon;
    this.tomatoes = builder.tomatoes;
    this.cheese = builder.cheese;
    this.olives = builder.olives;
  }

  static get Builder() {
    class PizzaBuilder {
      price = 0;
      mushrooms = [];
      bacon = [];
      tomatoes = [];
      cheese = [];
      olives = [];

      constructor(client) {
        this.client = client;
      }

      byCake(cake) {
        this.cake = cake;
        return this;
      }

      withMushrooms(count) {
        for (let i = 0; i < count; i++) {
          this.mushrooms.push(new Mushroom(PRICE_PER_UNIT_MUSHROOMS));
        }
        return this;
      }

      withBacon(count) {
        for (let i = 0; i < count; i++) {
          this.bacon.push(new Bacon(PRICE_PER_UNIT_BACON));
        }
        return this;
      }

      withTomatoes(count) {
        for (let i = 0; i < count; i++) {
          this.tomatoes.push(new Tomato(PRICE_PER_UNIT_TOMATOES));
        }
        return this;
      }

      withCheese(count) {
        for (let i = 0; i < count; i++) {
          this.cheese.push(new Cheese(PRICE_PER_UNIT_CHEESE));
        }
        return this;
      }

      withOlives(count) {
        for (let i = 0; i < count; i++) {
          this.olives.push(new Olive(PRICE_PER_UNIT_OLIVES));
        }
        return this;
      }

      build() {
        this.mushrooms.forEach(e => this.price += e.pricePerUnit);
        this.bacon.forEach(e => this.price += e.pricePerUnit);
        this.tomatoes.forEach(e => this.price += e.pricePerUnit);
        this.cheese.forEach(e => this.price += e.pricePerUnit);
        this.olives.forEach(e => this.price += e.pricePerUnit);
        this.price += this.cake.pricePerUnit;
        this.price = Math.floor(this.price);
        return new Pizza(this);
      }
    }

    return PizzaBuilder;
  }
}

/* Customer data. */
class Customer {
  constructor(id, firstName, lastName, surname, phone, deliveryAddress) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.surname = surname;
    this.phone = phone;
    this.deliveryAddress = deliveryAddress;
  }
}

/* The mediator, who is preparing a pizza to the customer. */
class PizzaCustomer {
  cake;
  resultProduct;

  constructor(customer, contentManager, sizeSelectors, bag) {
    this.contentManager = contentManager;
    this.customer = customer;
    this.sizes = sizeSelectors;
    this.bag = bag;
  }

  /* Stage one: find out the size of pizza. */
  readSize() {
    const self = this;
    this.sizes.forEach(e => e.addEventListener('click', function() {
      let size = this.childNodes[1].children[0].children[1].dataset.size;
      if (size === 'small') {
        self.cake = new SmallCake(PRICE_PER_UNIT_SMALL_CAKE);
      } else if (size === 'medium') {
        self.cake = new MediumCake(PRICE_PER_UNIT_MEDIUM_CAKE);
      } else if (size === 'large') {
        self.cake = new LargeCake(PRICE_PER_UNIT_LARGE_CAKE);
      }
      self.contentManager.suggestIngredients();
    }));
  }

  /* Step two: Count cost based on size and ingredients. */
  prepareResultProduct(pizzaBuilder) {
    // ... (https://dev.to/jfet97/the-shortest-way-to-conditional-insert-properties-into-an-object-literal-4ag7)
    // A very convenient operator for creating a property in an object by
    // condition.
    return {
      cake: pizzaBuilder.cake,

      ...pizzaBuilder.mushrooms.length !== 0 && {
        mushrooms: pizzaBuilder.mushrooms,
      },

      ...pizzaBuilder.bacon.length !== 0 && {
        bacon: pizzaBuilder.bacon,
      },

      ...pizzaBuilder.tomatoes.length !== 0 && {
        tomatoes: pizzaBuilder.tomatoes,
      },

      ...pizzaBuilder.cheese.length !== 0 && {
        cheese: pizzaBuilder.cheese,
      },

      ...pizzaBuilder.olives.length !== 0 && {
        olives: pizzaBuilder.olives,
      },
    };
  }

  prepareOrder() {
    let pizzaBuilder = new Pizza.Builder(this.customer).
        byCake(this.cake).
        withMushrooms(+this.contentManager.ingredients[0].children[1].innerHTML).
        withBacon(+this.contentManager.ingredients[1].children[1].innerHTML).
        withTomatoes(+this.contentManager.ingredients[2].children[1].innerHTML).
        withCheese(+this.contentManager.ingredients[3].children[1].innerHTML).
        withOlives(+this.contentManager.ingredients[4].children[1].innerHTML).
        build();
    this.bag.text.innerHTML = pizzaBuilder.price;
    this.resultProduct = this.prepareResultProduct(pizzaBuilder);
  }

  buildOrder() {
    this.bag.selector.addEventListener('mouseout', () => this.bag.selector.blur());

    this.bag.selector.addEventListener('click', () => this.prepareOrder());
  }

  /* Stage three: we all know, go to checkout. */
  addToBag() {
    this.bag.button.addEventListener('click', () => {
      this.contentManager.checkoutOrder(this.resultProduct);
    });
  }
}

class ContentManager {
  client;

  constructor() {
    // Only the first div is initially displayed.
    this.contentAsElements.forEach(e => e.style.display = 'none');
    this.show(0);
  }

  get content() {
    return document.querySelector('.content-container');
  }

  get contentAsElements() {
    let array = [];
    for (let childKey of this.content.children) {
      if (childKey.classList.contains('content')) {
        array.push(childKey);
      }
    }
    return array;
  }

  get ingredients() {
    return document.querySelectorAll('.ingredients li');
  }

  get body() {
    return document.querySelector('body');
  }

  get userFullName() {
    return document.querySelector('#user_full_name');
  }

  get orderTable() {
    return document.querySelector('.table-order');
  }

  /* What we point to "page refresh". */
  hide(index) {
    this.content.children[index].style.display = 'none';
  }

  show(index) {
    this.content.children[index].style.display = 'block';
  }

  updateStage(text) {
    document.querySelector('.nav-order li:last-child a').innerHTML = text;
  }

  /* Ingredient selection. */
  resetIngredient(ingredient) {
    ingredient.children[1].innerHTML = '-1';
  }

  moreIngredient(ingredient) {
    let value = +ingredient.children[1].innerHTML;
    if (value++ === INGREDIENTS_LIMIT) {
      return;
    }

    ingredient.children[1].innerHTML = `${value}`;
    document.querySelector('.summary-calc').click();
  }

  suggestIngredients() {
    this.hide(0);
    this.show(1);
    this.updateStage('Ingredients');
    this.ingredients.forEach(e => {
      e.children[0].addEventListener('click', () => this.resetIngredient(e));
      e.addEventListener('click', () => this.moreIngredient(e));
      e.addEventListener('mouseout', function() {
        for (let child of this.children) {
          child.blur();
        }
        this.blur();
      });
    });
  }

  /* Validation of order entry. */
  createUser() {
    let clientInfo = document.querySelectorAll('.checkable-input');
    this.client = new Customer(CLIENT_ID, clientInfo[0].value,
        clientInfo[1].value, clientInfo[2].value, clientInfo[3].value,
        clientInfo[4].value);
  }

  validateForm(resultProduct) {
    let inputs = document.querySelectorAll('.checkable-input');
    let formValidator = new FormValidator(inputs);
    let submitButton = document.querySelector('#submit-button');
    submitButton.addEventListener('click', () => {
      inputs.forEach(e => e.addEventListener('keyup', () => this.validate(submitButton, formValidator)));
      if (!this.validate(submitButton, formValidator)) {
        return false;
      }
      this.confirm(resultProduct);
      return false;
    });
  }

  validate(submitButton, formValidator) {
    submitButton.blur();
    if (formValidator.cefields()) {
      return false;
    }
    if (formValidator.cfname('.input-name')) {
      return false;
    }
    if (formValidator.cfphone('#user_phone')) {
      return false;
    }
    if (formValidator.cdaddress('#user_delivery_address')) {
      return false;
    }

    return true;
  }

  checkoutOrder(resultProduct) {
    this.hide(1);
    this.show(2);
    this.updateStage('Checkout order');
    this.body.style.backgroundColor = '#F3F3F3';
    this.validateForm(resultProduct);
  }

  /* Validation was successful, we ask for confirmation. */
  generateTable(resultProduct) {
    for (let i = 0; i < Object.keys(resultProduct).length; i++) {

      let values = Object.values(resultProduct)[i];
      let isNull = typeof values.length == 'undefined';

      let name = Object.keys(resultProduct)[i];
      let quantity = isNull ? 1 : Object.values(resultProduct)[i].length;
      let pricePerUnit = isNull ? values.pricePerUnit : values[0].pricePerUnit;

      let row = this.orderTable.insertRow();
      row.innerHTML = `<th scope="row">${i}</th><td class="text-capitalize">${name}</td><td>${quantity}</td><td>${pricePerUnit}</td>`;
    }
  }

  confirm(resultProduct) {
    this.hide(2);
    this.show(3);
    this.updateStage('Confirmation of an order');
    this.body.style.backgroundColor = '#FFFFFF';
    this.createUser();
    this.userFullName.innerHTML = `${this.client.lastName} ${this.client.firstName} ${this.client.surname} (${this.client.id})`;
    this.generateTable(resultProduct);
  }
}

let pizzaCustomer = new PizzaCustomer(
    new Customer(1, 'Jose', 'Thomas', 'Sees', '785-643-5769',
        '1895 Little Acres Lane'), new ContentManager(),
    document.querySelectorAll('.feature-item'), {
      button: document.querySelector('.summary-bag'),
      selector: document.querySelector('.summary-calc'),
      text: document.querySelector('.summary-price'),
    });
pizzaCustomer.readSize();
pizzaCustomer.buildOrder();
pizzaCustomer.addToBag();