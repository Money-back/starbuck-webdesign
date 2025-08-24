const drinks = [
  {
    id: 1,
    name: "Caffè Latte",
    desc: "Espresso with steamed milk and a light layer of foam.",
    price: 4.50,
    discountPrice: 4.00,
  },
  {
    id: 2,
    name: "Caramel Macchiato",
    desc: "Vanilla syrup, steamed milk, espresso, and caramel drizzle.",
    price: 5.25,
    discountPrice: 4.75,
  },
  {
    id: 3,
    name: "Cappuccino",
    desc: "Espresso topped with steamed milk foam.",
    price: 4.00,
    discountPrice: 3.50,
  },
  {
    id: 4,
    name: "Pumpkin Spice Latte",
    desc: "Espresso, steamed milk, pumpkin spice syrup and whipped cream.",
    price: 5.50,
    discountPrice: 5.00,
  },
  {
    id: 5,
    name: "Mocha",
    desc: "Espresso with steamed milk and chocolate syrup.",
    price: 4.75,
    discountPrice: 4.50,
  },
  {
    id: 6,
    name: "Iced Coffee",
    desc: "Freshly brewed coffee served chilled over ice.",
    price: 3.25,
    discountPrice: 3.00,
  },
];

const cart = {};

function formatPrice(num) {
  return '$' + num.toFixed(2);
}

const menuGrid = document.getElementById('menuGrid');

function renderMenu() {
  menuGrid.innerHTML = '';
  drinks.forEach(drink => {
    const card = document.createElement('article');
    card.className = 'drink-card';
    card.innerHTML = `
      <h3 class="drink-name">${drink.name}</h3>
      <div class="price-wrap">
        <span class="price-current">${formatPrice(drink.discountPrice)}</span>
        <span class="price-old">${formatPrice(drink.price)}</span>
      </div>
      <p class="drink-desc">${drink.desc}</p>
      <div class="controls" data-id="${drink.id}">
        <button class="add-btn" title="Add to order" data-id="${drink.id}">+</button>
      </div>
    `;
    menuGrid.appendChild(card);
  });
}

const orderSummaryList = document.getElementById('orderSummaryList');
const orderTotalNew = document.getElementById('orderTotalNew');

function renderOrderNew() {
  orderSummaryList.innerHTML = '';
  let total = 0;

  Object.keys(cart).forEach(id => {
    const drink = drinks.find(d => d.id === +id);
    const qty = cart[id];
    const price = drink.discountPrice * qty;
    total += price;

    const itemEl = document.createElement('div');
    itemEl.className = 'order-item-new';
    itemEl.innerHTML = `
      <p class="order-item-name-new">${drink.name}</p>
      <p class="order-item-qty-new">Quantity: ${qty}</p>
      <p class="order-item-price-new">Price: ${formatPrice(price)}</p>
    `;
    orderSummaryList.appendChild(itemEl);
  });

  orderTotalNew.textContent = formatPrice(total);
}

function addToCart(id) {
  if (cart[id]) {
    cart[id]++;
  } else {
    cart[id] = 1;
  }
  renderOrderNew();
  renderMenuControls();
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) {
    delete cart[id];
  }
  renderOrderNew();
  renderMenuControls();
}

function renderMenuControls() {
  document.querySelectorAll('.drink-card .controls').forEach(controlDiv => {
    const id = controlDiv.dataset.id;
    if (cart[id]) {
      controlDiv.innerHTML = `
        <div class="qty-controls">
          <button class="qty-control dec" data-id="${id}">−</button>
          <span class="qty-num">${cart[id]}</span>
          <button class="qty-control inc" data-id="${id}">+</button>
        </div>
      `;
    } else {
      controlDiv.innerHTML = `
        <button class="add-btn" title="Add to order" data-id="${id}">+</button>
      `;
    }
  });
}

// Event delegation for menu controls
menuGrid.addEventListener('click', e => {
  if (e.target.matches('.add-btn')) {
    const id = e.target.dataset.id;
    addToCart(id);
  } else if (e.target.matches('.qty-control.inc')) {
    const id = e.target.dataset.id;
    changeQty(id, 1);
  } else if (e.target.matches('.qty-control.dec')) {
    const id = e.target.dataset.id;
    changeQty(id, -1);
  }
});

document.getElementById('placeOrderBtn').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert('Please add some drinks to your order first!');
    return;
  }
  alert('Thanks for your order! Total: ' + orderTotalNew.textContent);
});

// Initialize
renderMenu();
renderOrderNew();
