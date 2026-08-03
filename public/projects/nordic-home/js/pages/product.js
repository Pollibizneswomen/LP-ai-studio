
import { PRODUCTS } from "../data/products.js";
import { store } from "../core/store.js";
import { formatPrice, lockScroll } from "../core/utils.js";
import { template, bind } from "../components/product-card.js";
import { showToast } from "../components/toast.js";

const colorHex = {
  "Бежевый":"#d4c3b2","Оливковый":"#6f785f","Молочный":"#eee8df","Графитовый":"#45484c",
  "Дуб":"#b28763","Орех":"#79553d","Тёмный дуб":"#5e4435","Льняной":"#d8c9b7","Чёрный":"#222",
  "Овсяный":"#d8c9aa","Зелёный":"#5f765d","Песочный":"#cdb79d","Терракотовый":"#a85f48",
  "Кремовый":"#eee2d0","Коричневый":"#76503b","Натуральный дуб":"#b98d64","Копчёный дуб":"#684b38",
  "Серый":"#8c8b86","Светлый ясень":"#cfad83","Пудровый":"#d8b4ae","Серо-бежевый":"#aaa096",
  "Тёмно-синий":"#33465a","Натуральный":"#d9c8b2","Латунь":"#b89154"
};

const sizeOptions = {
  "Диваны": ["220 × 98 см", "260 × 98 см", "300 × 110 см"],
  "Кресла": ["Стандарт", "Широкое"],
  "Столы": ["Ø 80 см", "Ø 100 см", "120 × 70 см"],
  "Хранение": ["120 см", "160 см", "200 см"],
  "Кровати": ["140 × 200 см", "160 × 200 см", "180 × 200 см"],
  "Освещение": ["Стандарт"],
  "Стулья": ["Стандарт"]
};

const copyByCategory = {
  "Диваны": "Мягкий силуэт, глубокая посадка и упругие подушки создают комфорт для долгих вечеров. Модель легко вписывается как в спокойный минималистичный интерьер, так и в более выразительное пространство.",
  "Кресла": "Выразительная форма и продуманная эргономика. Кресло поддерживает спину, не перегружает интерьер и одинаково хорошо работает в гостиной, спальне или зоне чтения.",
  "Столы": "Чистая геометрия и натуральная фактура древесины. Поверхность защищена экологичным покрытием, устойчивым к повседневному использованию.",
  "Хранение": "Вместительная система хранения с лаконичным фасадом и тихой фурнитурой. Внутреннее пространство организовано так, чтобы вещи оставались доступными и аккуратными.",
  "Кровати": "Мягкое изголовье, устойчивая конструкция и спокойные пропорции помогают создать расслабляющую атмосферу спальни.",
  "Освещение": "Мягкий рассеянный свет делает пространство теплее, а лаконичная форма светильника остаётся актуальной вне зависимости от трендов.",
  "Стулья": "Удобная посадка, лёгкий силуэт и прочный каркас для ежедневного использования."
};

let product;
let selectedColor;
let selectedSize;
let quantity = 1;
let currentImage = 0;
let galleryImages = [];

function getProduct() {
  const id = new URLSearchParams(location.search).get("id") || "aurora";
  return PRODUCTS.find(item => item.id === id) || PRODUCTS[0];
}

function gallerySvg(product, index) {
  const labels = ["Главный вид", "В интерьере", "Детали", "Материал"];
  const transforms = [
    "",
    "transform:scale(1.12) translate(-2%,2%)",
    "transform:scale(1.28) translate(7%,-3%)",
    "transform:scale(1.42) translate(-8%,5%)"
  ];
  return {src: product.image, label: labels[index], style: transforms[index]};
}

function renderGallery() {
  const main = document.querySelector("[data-main-image]");
  const thumbs = document.querySelector("[data-thumbnails]");
  const active = galleryImages[currentImage];

  main.innerHTML = `<img src="${active.src}" alt="${product.name} — ${active.label}" style="${active.style}">`;
  thumbs.innerHTML = galleryImages.map((image,index)=>`
    <button class="product-thumb ${index===currentImage?"is-active":""}" type="button" data-image-index="${index}">
      <img src="${image.src}" alt="${image.label}" style="${image.style}">
      <span>${image.label}</span>
    </button>
  `).join("");
}

function renderProduct() {
  document.title = `${product.name} — Nordic Home`;
  document.querySelector("[data-breadcrumb-product]").textContent = product.name;
  document.querySelector("[data-product-category]").textContent = product.category;
  document.querySelector("[data-product-name]").textContent = product.name;
  document.querySelector("[data-product-rating]").innerHTML = `★ ${product.rating} <a href="#reviews">${product.reviews} отзывов</a>`;
  document.querySelector("[data-product-price]").textContent = formatPrice(product.price);
  document.querySelector("[data-product-old-price]").innerHTML = product.oldPrice ? `<del>${formatPrice(product.oldPrice)}</del>` : "";
  document.querySelector("[data-product-stock]").textContent = product.inStock ? "В наличии" : "Под заказ";
  document.querySelector("[data-product-stock]").classList.toggle("is-order", !product.inStock);
  document.querySelector("[data-product-description]").textContent = copyByCategory[product.category] || copyByCategory["Стулья"];
  document.querySelector("[data-material-summary]").textContent = product.material;

  selectedColor = product.colors[0];
  selectedSize = (sizeOptions[product.category] || ["Стандарт"])[0];

  document.querySelector("[data-colors]").innerHTML = product.colors.map((color,index)=>`
    <button class="variant-swatch ${index===0?"is-active":""}" type="button" data-color="${color}" aria-label="${color}">
      <span style="--variant-color:${colorHex[color] || "#aaa"}"></span>
      <small>${color}</small>
    </button>
  `).join("");

  document.querySelector("[data-sizes]").innerHTML = (sizeOptions[product.category] || ["Стандарт"]).map((size,index)=>`
    <button class="variant-size ${index===0?"is-active":""}" type="button" data-size="${size}">${size}</button>
  `).join("");

  galleryImages = [0,1,2,3].map(index => gallerySvg(product,index));
  renderGallery();
  updateWishlistButton();
  renderDetails();
  renderRelated();
  rememberViewed();
}

function renderDetails() {
  const dimensions = selectedSize;
  const rows = [
    ["Материалы", product.material],
    ["Размер", dimensions],
    ["Каркас", product.category === "Освещение" ? "Сталь с порошковым покрытием" : "Массив древесины и мебельная фанера"],
    ["Производство", "Европа"],
    ["Гарантия", "5 лет"],
    ["Срок доставки", product.inStock ? "3–7 рабочих дней" : "4–6 недель"]
  ];
  document.querySelector("[data-specs]").innerHTML = rows.map(([key,value])=>`
    <div class="spec-row"><dt>${key}</dt><dd>${value}</dd></div>
  `).join("");
}

function updateWishlistButton() {
  const button = document.querySelector("[data-product-wishlist]");
  const liked = store.getState().wishlist.includes(product.id);
  button.classList.toggle("is-active", liked);
  button.innerHTML = `
    <svg><use href="assets/icons/sprite.svg#heart"></use></svg>
    ${liked ? "В избранном" : "В избранное"}
  `;
}

function renderRelated() {
  const related = PRODUCTS
    .filter(item => item.id !== product.id)
    .sort((a,b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0,4);
  const grid = document.querySelector("[data-related]");
  grid.innerHTML = related.map(template).join("");
  bind(grid);
}

function rememberViewed() {
  const key = "nordic-home-recently-viewed";
  let ids = [];
  try { ids = JSON.parse(localStorage.getItem(key)) || []; } catch {}
  ids = [product.id, ...ids.filter(id => id !== product.id)].slice(0,6);
  localStorage.setItem(key, JSON.stringify(ids));

  const recent = ids
    .filter(id => id !== product.id)
    .map(id => PRODUCTS.find(item => item.id === id))
    .filter(Boolean)
    .slice(0,4);

  const section = document.querySelector("[data-recent-section]");
  if (!recent.length) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  const grid = document.querySelector("[data-recent]");
  grid.innerHTML = recent.map(template).join("");
  bind(grid);
}

function openZoom() {
  const modal = document.querySelector("[data-zoom-modal]");
  const active = galleryImages[currentImage];
  modal.querySelector("img").src = active.src;
  modal.querySelector("img").style = active.style;
  modal.classList.add("is-open");
  lockScroll(true);
}

function closeZoom() {
  document.querySelector("[data-zoom-modal]").classList.remove("is-open");
  lockScroll(false);
}

function bindEvents() {
  document.querySelector("[data-thumbnails]").addEventListener("click", event => {
    const button = event.target.closest("[data-image-index]");
    if (!button) return;
    currentImage = Number(button.dataset.imageIndex);
    renderGallery();
  });

  document.querySelector("[data-main-image]").addEventListener("click", openZoom);
  document.querySelector("[data-open-zoom]").addEventListener("click", openZoom);
  document.querySelectorAll("[data-close-zoom]").forEach(button => button.addEventListener("click", closeZoom));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeZoom();
  });

  document.querySelector("[data-colors]").addEventListener("click", event => {
    const button = event.target.closest("[data-color]");
    if (!button) return;
    selectedColor = button.dataset.color;
    document.querySelectorAll("[data-color]").forEach(item => item.classList.toggle("is-active", item === button));
  });

  document.querySelector("[data-sizes]").addEventListener("click", event => {
    const button = event.target.closest("[data-size]");
    if (!button) return;
    selectedSize = button.dataset.size;
    document.querySelectorAll("[data-size]").forEach(item => item.classList.toggle("is-active", item === button));
    renderDetails();
  });

  document.querySelector("[data-quantity-minus]").addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    document.querySelector("[data-quantity]").textContent = quantity;
  });
  document.querySelector("[data-quantity-plus]").addEventListener("click", () => {
    quantity = Math.min(10, quantity + 1);
    document.querySelector("[data-quantity]").textContent = quantity;
  });

  document.querySelector("[data-add-product]").addEventListener("click", () => {
    store.addToCart(product.id, quantity);
    showToast(`${product.name} добавлен в корзину`);
  });

  document.querySelector("[data-buy-now]").addEventListener("click", () => {
    store.addToCart(product.id, quantity);
    location.href = "/cart.html";
  });

  document.querySelector("[data-product-wishlist]").addEventListener("click", () => {
    const added = store.toggleWishlist(product.id);
    updateWishlistButton();
    showToast(added ? "Добавлено в избранное" : "Удалено из избранного");
  });

  document.querySelectorAll("[data-detail-toggle]").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.closest(".product-detail");
      item.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(item.classList.contains("is-open")));
    });
  });

  document.querySelector("[data-review-form]").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    showToast("Спасибо! Отзыв отправлен на модерацию");
    form.reset();
    document.querySelector("[data-review-dialog]").close();
  });

  document.querySelector("[data-open-review]").addEventListener("click", () => {
    document.querySelector("[data-review-dialog]").showModal();
  });
  document.querySelector("[data-close-review]").addEventListener("click", () => {
    document.querySelector("[data-review-dialog]").close();
  });
}

export function initProduct() {
  product = getProduct();
  renderProduct();
  bindEvents();
}
