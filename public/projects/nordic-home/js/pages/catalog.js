import { PRODUCTS } from "../data/products.js";
import { template, bind } from "../components/product-card.js";
import { formatPrice, lockScroll } from "../core/utils.js";

const PAGE_SIZE = 9;

const state = {
  query: "",
  categories: new Set(),
  rooms: new Set(),
  materials: new Set(),
  colors: new Set(),
  minPrice: 0,
  maxPrice: Math.max(...PRODUCTS.map(product => product.price)),
  inStock: false,
  newOnly: false,
  saleOnly: false,
  sort: "featured",
  columns: 3,
  page: 1
};

const els = {};

function readUrl() {
  const params = new URLSearchParams(location.search);
  state.query = params.get("q") || "";
  state.categories = new Set(params.getAll("category"));
  state.rooms = new Set(params.getAll("room"));
  state.materials = new Set(params.getAll("material"));
  state.colors = new Set(params.getAll("color"));
  state.minPrice = Number(params.get("min")) || 0;
  state.maxPrice = Number(params.get("max")) || Math.max(...PRODUCTS.map(product => product.price));
  state.inStock = params.get("stock") === "1";
  state.newOnly = params.get("new") === "1" || params.get("collection") === "new";
  state.saleOnly = params.get("sale") === "1";
  state.sort = params.get("sort") || "featured";
  state.columns = Number(params.get("view")) || 3;
  state.page = Number(params.get("page")) || 1;
}

function writeUrl() {
  const params = new URLSearchParams();
  if (state.query) params.set("q", state.query);
  [...state.categories].forEach(value => params.append("category", value));
  [...state.rooms].forEach(value => params.append("room", value));
  [...state.materials].forEach(value => params.append("material", value));
  [...state.colors].forEach(value => params.append("color", value));
  if (state.minPrice > 0) params.set("min", state.minPrice);
  if (state.maxPrice < Math.max(...PRODUCTS.map(product => product.price))) params.set("max", state.maxPrice);
  if (state.inStock) params.set("stock", "1");
  if (state.newOnly) params.set("new", "1");
  if (state.saleOnly) params.set("sale", "1");
  if (state.sort !== "featured") params.set("sort", state.sort);
  if (state.columns !== 3) params.set("view", state.columns);
  if (state.page > 1) params.set("page", state.page);
  const query = params.toString();
  history.replaceState({}, "", `${location.pathname}${query ? `?${query}` : ""}`);
}

function unique(field) {
  return [...new Set(PRODUCTS.flatMap(product => Array.isArray(product[field]) ? product[field] : product[field]))].sort();
}

function countFor(type, value) {
  if (type === "category") return PRODUCTS.filter(product => product.category === value).length;
  if (type === "room") return PRODUCTS.filter(product => product.room === value).length;
  if (type === "material") return PRODUCTS.filter(product => product.materials.includes(value)).length;
  if (type === "color") return PRODUCTS.filter(product => product.colors.includes(value)).length;
  return 0;
}

function checkboxList(type, values, selected) {
  return values.map(value => `
    <label class="filter-option">
      <input type="checkbox" name="${type}" value="${value}" ${selected.has(value) ? "checked" : ""}>
      <span class="filter-option__box"></span>
      <span class="filter-option__label">${value}</span>
      <small>${countFor(type, value)}</small>
    </label>
  `).join("");
}

function colorList(values, selected) {
  return values.map(value => `
    <label class="color-option">
      <input type="checkbox" name="color" value="${value}" ${selected.has(value) ? "checked" : ""}>
      <span class="color-option__swatch" style="--swatch:${colorMap(value)}"></span>
      <span>${value}</span>
    </label>
  `).join("");
}

function colorMap(value) {
  const map = {
    "Бежевый":"#d4c3b2","Оливковый":"#6f785f","Молочный":"#eee8df","Графитовый":"#45484c",
    "Дуб":"#b28763","Орех":"#79553d","Тёмный дуб":"#5e4435","Льняной":"#d8c9b7","Чёрный":"#222",
    "Овсяный":"#d8c9aa","Зелёный":"#5f765d","Песочный":"#cdb79d","Терракотовый":"#a85f48",
    "Кремовый":"#eee2d0","Коричневый":"#76503b","Натуральный дуб":"#b98d64","Копчёный дуб":"#684b38",
    "Серый":"#8c8b86","Светлый ясень":"#cfad83","Пудровый":"#d8b4ae","Серо-бежевый":"#aaa096",
    "Тёмно-синий":"#33465a","Натуральный":"#d9c8b2","Латунь":"#b89154"
  };
  return map[value] || "#aaa";
}

function renderFilterContent() {
  els.categories.innerHTML = checkboxList("category", unique("category"), state.categories);
  els.rooms.innerHTML = checkboxList("room", unique("room"), state.rooms);
  els.materials.innerHTML = checkboxList("material", unique("materials"), state.materials);
  els.colors.innerHTML = colorList(unique("colors"), state.colors);

  els.minPrice.min = 0;
  els.minPrice.max = Math.max(...PRODUCTS.map(product => product.price));
  els.maxPrice.min = 0;
  els.maxPrice.max = Math.max(...PRODUCTS.map(product => product.price));
  els.minPrice.value = state.minPrice;
  els.maxPrice.value = state.maxPrice;
  els.minPriceValue.value = state.minPrice;
  els.maxPriceValue.value = state.maxPrice;
  els.stock.checked = state.inStock;
  els.newOnly.checked = state.newOnly;
  els.saleOnly.checked = state.saleOnly;
  els.search.value = state.query;
  els.sort.value = state.sort;
}

function filteredProducts() {
  let items = PRODUCTS.filter(product => {
    const haystack = `${product.name} ${product.category} ${product.room} ${product.material} ${product.colors.join(" ")}`.toLowerCase();
    if (state.query && !haystack.includes(state.query.toLowerCase())) return false;
    if (state.categories.size && !state.categories.has(product.category)) return false;
    if (state.rooms.size && !state.rooms.has(product.room)) return false;
    if (state.materials.size && !product.materials.some(value => state.materials.has(value))) return false;
    if (state.colors.size && !product.colors.some(value => state.colors.has(value))) return false;
    if (product.price < state.minPrice || product.price > state.maxPrice) return false;
    if (state.inStock && !product.inStock) return false;
    if (state.newOnly && !product.new) return false;
    if (state.saleOnly && !product.sale) return false;
    return true;
  });

  const sorters = {
    featured: (a,b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating,
    newest: (a,b) => Number(b.new) - Number(a.new) || b.rating - a.rating,
    priceAsc: (a,b) => a.price - b.price,
    priceDesc: (a,b) => b.price - a.price,
    rating: (a,b) => b.rating - a.rating,
    discount: (a,b) => discount(b) - discount(a)
  };
  return items.sort(sorters[state.sort] || sorters.featured);
}

function discount(product) {
  return product.oldPrice ? (product.oldPrice - product.price) / product.oldPrice : 0;
}

function renderChips() {
  const chips = [];
  state.categories.forEach(value => chips.push(["category", value]));
  state.rooms.forEach(value => chips.push(["room", value]));
  state.materials.forEach(value => chips.push(["material", value]));
  state.colors.forEach(value => chips.push(["color", value]));
  if (state.query) chips.push(["query", `Поиск: ${state.query}`]);
  if (state.inStock) chips.push(["stock", "В наличии"]);
  if (state.newOnly) chips.push(["new", "Новинки"]);
  if (state.saleOnly) chips.push(["sale", "Со скидкой"]);
  if (state.minPrice > 0 || state.maxPrice < Math.max(...PRODUCTS.map(p=>p.price))) {
    chips.push(["price", `${formatPrice(state.minPrice)} — ${formatPrice(state.maxPrice)}`]);
  }

  els.chips.innerHTML = chips.length ? chips.map(([type,label]) => `
    <button class="filter-chip" type="button" data-chip-type="${type}" data-chip-value="${label.replace("Поиск: ","")}">
      ${label}<span>×</span>
    </button>
  `).join("") + `<button class="filter-chip filter-chip--clear" type="button" data-clear-all>Сбросить всё</button>` : "";
}

function renderPagination(total) {
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  state.page = Math.min(state.page, pages);
  if (pages <= 1) {
    els.pagination.innerHTML = "";
    return;
  }

  let html = `<button class="pagination__arrow" data-page="${Math.max(1,state.page-1)}" ${state.page===1?"disabled":""}>←</button>`;
  for (let page=1; page<=pages; page++) {
    html += `<button class="pagination__page ${page===state.page?"is-active":""}" data-page="${page}">${page}</button>`;
  }
  html += `<button class="pagination__arrow" data-page="${Math.min(pages,state.page+1)}" ${state.page===pages?"disabled":""}>→</button>`;
  els.pagination.innerHTML = html;
}

function render() {
  const all = filteredProducts();
  const start = (state.page - 1) * PAGE_SIZE;
  const pageItems = all.slice(start, start + PAGE_SIZE);

  els.count.textContent = `${all.length} ${plural(all.length, "товар", "товара", "товаров")}`;
  els.grid.dataset.columns = state.columns;
  els.grid.innerHTML = pageItems.length
    ? pageItems.map(template).join("")
    : `<div class="catalog-empty">
        <div class="catalog-empty__icon">⌁</div>
        <h2>Ничего не найдено</h2>
        <p>Измените параметры фильтрации или сбросьте выбранные фильтры.</p>
        <button class="button button--dark" type="button" data-clear-all>Сбросить фильтры</button>
      </div>`;

  document.querySelectorAll("[data-view]").forEach(button => {
    button.classList.toggle("is-active", Number(button.dataset.view) === state.columns);
  });

  renderChips();
  renderPagination(all.length);
  writeUrl();
}

function plural(value, one, few, many) {
  const mod10 = value % 10;
  const mod100 = value % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
}

function updateFromForm() {
  state.query = els.search.value.trim();
  state.categories = new Set([...document.querySelectorAll('input[name="category"]:checked')].map(input=>input.value));
  state.rooms = new Set([...document.querySelectorAll('input[name="room"]:checked')].map(input=>input.value));
  state.materials = new Set([...document.querySelectorAll('input[name="material"]:checked')].map(input=>input.value));
  state.colors = new Set([...document.querySelectorAll('input[name="color"]:checked')].map(input=>input.value));
  state.minPrice = Math.min(Number(els.minPrice.value), Number(els.maxPrice.value));
  state.maxPrice = Math.max(Number(els.minPrice.value), Number(els.maxPrice.value));
  els.minPriceValue.value = state.minPrice;
  els.maxPriceValue.value = state.maxPrice;
  state.inStock = els.stock.checked;
  state.newOnly = els.newOnly.checked;
  state.saleOnly = els.saleOnly.checked;
  state.sort = els.sort.value;
  state.page = 1;
  render();
}

function removeChip(type, value) {
  if (["category","room","material","color"].includes(type)) {
    const map = {category:state.categories,room:state.rooms,material:state.materials,color:state.colors};
    map[type].delete(value);
  }
  if (type === "query") state.query = "";
  if (type === "stock") state.inStock = false;
  if (type === "new") state.newOnly = false;
  if (type === "sale") state.saleOnly = false;
  if (type === "price") {
    state.minPrice = 0;
    state.maxPrice = Math.max(...PRODUCTS.map(product=>product.price));
  }
  state.page = 1;
  renderFilterContent();
  render();
}

function resetAll() {
  state.query = "";
  state.categories.clear();
  state.rooms.clear();
  state.materials.clear();
  state.colors.clear();
  state.minPrice = 0;
  state.maxPrice = Math.max(...PRODUCTS.map(product=>product.price));
  state.inStock = false;
  state.newOnly = false;
  state.saleOnly = false;
  state.sort = "featured";
  state.page = 1;
  renderFilterContent();
  render();
}

function bindEvents() {
  els.form.addEventListener("input", event => {
    if (event.target.matches('input[type="checkbox"], input[type="range"]')) updateFromForm();
  });
  els.form.addEventListener("change", updateFromForm);
  els.search.addEventListener("input", () => {
    clearTimeout(els.search._timer);
    els.search._timer = setTimeout(updateFromForm, 180);
  });

  els.minPriceValue.addEventListener("change", () => {
    els.minPrice.value = Math.max(0, Number(els.minPriceValue.value) || 0);
    updateFromForm();
  });
  els.maxPriceValue.addEventListener("change", () => {
    els.maxPrice.value = Math.max(0, Number(els.maxPriceValue.value) || state.maxPrice);
    updateFromForm();
  });

  els.grid.addEventListener("click", event => {
    if (event.target.closest("[data-clear-all]")) resetAll();
  });

  els.chips.addEventListener("click", event => {
    const clear = event.target.closest("[data-clear-all]");
    if (clear) return resetAll();
    const chip = event.target.closest("[data-chip-type]");
    if (chip) removeChip(chip.dataset.chipType, chip.dataset.chipValue);
  });

  els.pagination.addEventListener("click", event => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    state.page = Number(button.dataset.page);
    render();
    window.scrollTo({top: els.top.offsetTop - 100, behavior:"smooth"});
  });

  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => {
      state.columns = Number(button.dataset.view);
      render();
    });
  });

  const drawer = document.querySelector("[data-filter-drawer]");
  const overlay = document.querySelector("[data-filter-overlay]");
  const openButton = document.querySelector("[data-open-filters]");
  const closeButtons = document.querySelectorAll("[data-close-filters]");

  const closeDrawer = () => {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-visible");
    lockScroll(false);
  };
  openButton.addEventListener("click", () => {
    drawer.classList.add("is-open");
    overlay.classList.add("is-visible");
    lockScroll(true);
  });
  closeButtons.forEach(button => button.addEventListener("click", closeDrawer));
  overlay.addEventListener("click", closeDrawer);

  document.querySelectorAll("[data-accordion]").forEach(section => {
    const button = section.querySelector("[data-accordion-button]");
    button.addEventListener("click", () => {
      section.classList.toggle("is-collapsed");
      button.setAttribute("aria-expanded", String(!section.classList.contains("is-collapsed")));
    });
  });
}

export function initCatalog() {
  readUrl();
  Object.assign(els, {
    top: document.querySelector("[data-catalog-top]"),
    form: document.querySelector("[data-filter-form]"),
    categories: document.querySelector("[data-filter-categories]"),
    rooms: document.querySelector("[data-filter-rooms]"),
    materials: document.querySelector("[data-filter-materials]"),
    colors: document.querySelector("[data-filter-colors]"),
    minPrice: document.querySelector("[data-min-price]"),
    maxPrice: document.querySelector("[data-max-price]"),
    minPriceValue: document.querySelector("[data-min-price-value]"),
    maxPriceValue: document.querySelector("[data-max-price-value]"),
    stock: document.querySelector("[data-stock]"),
    newOnly: document.querySelector("[data-new]"),
    saleOnly: document.querySelector("[data-sale]"),
    search: document.querySelector("[data-catalog-search]"),
    sort: document.querySelector("[data-sort]"),
    count: document.querySelector("[data-result-count]"),
    grid: document.querySelector("[data-catalog-grid]"),
    chips: document.querySelector("[data-filter-chips]"),
    pagination: document.querySelector("[data-pagination]")
  });

  renderFilterContent();
  bind(els.grid);
  bindEvents();
  render();
}
