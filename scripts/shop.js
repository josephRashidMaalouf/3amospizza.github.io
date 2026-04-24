const plates = [
  {
    name: "Falafeltallrik",
    category: "plate",
    price: 115,
    picURL: "./media/plates/falafel.webp",
    modalTag: "falafelPlateModal",
    description:
      "Krispig falafel med krispiga pommes, färsk sallad och vår hemlagade tarator.",
  },
  {
    name: "Kebabtallrik",
    category: "plate",
    price: 145,
    picURL: "./media/plates/kebabplate.webp",
    modalTag: "kebabPlateModal",
    description:
      "Mört nötkött, krispiga pommes, fräsch sallad och valfri sås. En smakresa till traditionella smaker!",
  },
  {
    name: "Shawarmatallrik",
    category: "plate",
    price: 155,
    picURL: "./media/plates/shawarma.webp",
    modalTag: "ShawarmaPlateModal",
    description:
      "Traditionell shawarma med pommes, fräsch sallad och våra hemliga kryddor. En smakupplevelse utöver det vanliga!",
  },
  {
    name: "Marghareta",
    category: "pizza",
    price: 105,
    picURL: "./media/pizzas/marghareta.webp",
    modalTag: "margharetaPizzaModal",
    description:
      "En klassisk Margherita pizza med mozzarella, tomater och basilika. En enkel men älskad favorit!",
  },
  {
    name: "Kebab pizza",
    category: "pizza",
    price: 145,
    picURL: "./media/pizzas/kebabpizza.webp",
    modalTag: "KebabPizzaModal",
    description:
      "Mör kebab, smältande ost och krispiga grönsaker. En perfekt fusion av smaker på en pizza!",
  },
  {
    name: "Hawaii pizza",
    category: "pizza",
    price: 145,
    picURL: "./media/pizzas/hawaii.webp",
    modalTag: "hawaiiPizzaModal",
    description:
      "En tropisk smakresa med ananas, skinka och ost. Sött och salt, perfekt balanserad!",
  },
];

const cart = [];

const menuGrid = document.getElementById("plateMenus");
const cartList = document.getElementById("cartCheckOutInfoList");
const priceEl = document.getElementById("price");
const itemsEl = document.getElementById("itemsInBasket");
const cartFab = document.getElementById("cartFab");
const orderBtn = document.getElementById("orderBtn");

plates.forEach(createCard);
plates.forEach(createModal);
syncCartUI();

// Category filter
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    document.querySelectorAll(".menu-card-wrap").forEach((wrap) => {
      wrap.style.display =
        filter === "all" || wrap.dataset.category === filter ? "" : "none";
    });
  });
});

orderBtn.addEventListener("click", () => {
  makeOrder();
  new bootstrap.Toast(document.querySelector(".toast")).show();
});

function createCard(item) {
  const badgeLabel = item.category === "pizza" ? "Pizza" : "Tallrik";

  const wrap = document.createElement("div");
  wrap.className = "menu-card-wrap";
  wrap.dataset.category = item.category;

  wrap.innerHTML = `
    <div class="menu-card">
      <div class="menu-card-img-wrap">
        <img src="${item.picURL}" alt="${item.name}" loading="lazy">
        <span class="menu-card-badge">${badgeLabel}</span>
      </div>
      <div class="menu-card-body">
        <h5>${item.name}</h5>
        <p class="menu-card-desc">${item.description}</p>
        <div class="menu-card-footer">
          <span class="menu-card-price">${item.price} SEK</span>
          <div class="menu-card-actions">
            <button class="btn-info-custom"
              data-bs-toggle="modal"
              data-bs-target="#${item.modalTag}">Mer info</button>
            <button class="btn-add-custom">+ Lägg till</button>
          </div>
        </div>
      </div>
    </div>
  `;

  wrap.querySelector(".btn-add-custom").addEventListener("click", () => addToCart(item));
  menuGrid.appendChild(wrap);
}

function createModal(item) {
  const modal = document.createElement("div");
  modal.id = item.modalTag;
  modal.className = "modal fade";
  modal.setAttribute("tabindex", "-1");

  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">${item.name} &mdash; ${item.price} SEK</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Stäng"></button>
        </div>
        <div class="modal-body">
          <img src="${item.picURL}" alt="${item.name}" loading="lazy">
          <p>${item.description}</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-outline-custom" data-bs-dismiss="modal">Tillbaka</button>
          <button type="button" class="btn-primary-custom" data-bs-dismiss="modal" id="modal-add-${item.modalTag}">
            Lägg till i varukorg
          </button>
        </div>
      </div>
    </div>
  `;

  modal
    .querySelector(`#modal-add-${item.modalTag}`)
    .addEventListener("click", () => addToCart(item));

  document.body.appendChild(modal);
}

function addToCart(item) {
  cart.push(item);

  const emptyMsg = cartList.querySelector(".cart-empty");
  if (emptyMsg) emptyMsg.remove();

  const cartItem = document.createElement("div");
  cartItem.className = "cart-item";
  cartItem.innerHTML = `
    <div>
      <div class="cart-item-name">${item.name}</div>
      <div class="cart-item-price">${item.price} SEK</div>
    </div>
    <button class="cart-item-remove">Ta bort</button>
  `;

  cartItem.querySelector(".cart-item-remove").addEventListener("click", () => {
    removeFromCart(item);
    cartItem.remove();
    if (cart.length === 0) {
      cartList.innerHTML = `
        <div class="cart-empty">
          <span class="cart-empty-icon">🛒</span>
          <p>Din varukorg är tom</p>
        </div>`;
    }
  });

  cartList.appendChild(cartItem);
  syncCartUI();
}

function removeFromCart(item) {
  const idx = cart.findIndex((i) => i === item);
  if (idx > -1) cart.splice(idx, 1);
  syncCartUI();
}

function syncCartUI() {
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  priceEl.textContent = total + " SEK";
  itemsEl.textContent = cart.length;
  cartFab.classList.toggle("hidden", cart.length === 0);
}

function makeOrder() {
  const orderInfo = document.getElementById("orderInfo");

  if (cart.length < 1) {
    orderInfo.textContent = "Du har inte gjort någon beställning.";
    return;
  }

  cart.length = 0;
  cartList.innerHTML = `
    <div class="cart-empty">
      <span class="cart-empty-icon">🛒</span>
      <p>Din varukorg är tom</p>
    </div>`;
  orderInfo.textContent =
    "Välkommen att hämta upp din beställning om femton minuter!";
  syncCartUI();
}
