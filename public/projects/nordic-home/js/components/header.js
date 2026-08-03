import{PRODUCTS}from"../data/products.js";
import{store}from"../core/store.js";
import{debounce,formatPrice,lockScroll,qs}from"../core/utils.js";
export function initHeader(){
  const mega=qs("[data-mega]");
  const megaButton=qs("[data-mega-button]");
  const search=qs("[data-search]");
  const searchButton=qs("[data-search-button]");
  const searchInput=qs("[data-search-input]");
  const results=qs("[data-search-results]");
  const mobile=qs("[data-mobile]");
  const mobileButtons=document.querySelectorAll("[data-mobile-button]");
  const overlay=qs("[data-overlay]");
  const panels=[mega,search,mobile];

  const close=()=>{
    panels.forEach(panel=>panel?.classList.remove("is-open"));
    overlay.classList.remove("is-visible");
    lockScroll(false);
  };
  const open=panel=>{
    close();
    panel.classList.add("is-open");
    overlay.classList.add("is-visible");
    lockScroll(true);
  };

  megaButton.addEventListener("click",()=>mega.classList.contains("is-open")?close():open(mega));
  searchButton.addEventListener("click",()=>{open(search);setTimeout(()=>searchInput.focus(),30);});
  mobileButtons.forEach(button=>button.addEventListener("click",()=>mobile.classList.contains("is-open")?close():open(mobile)));
  overlay.addEventListener("click",close);
  document.addEventListener("keydown",event=>{if(event.key==="Escape")close();});

  searchInput.addEventListener("input",debounce(()=>{
    const query=searchInput.value.trim().toLowerCase();
    const found=PRODUCTS.filter(product=>`${product.name} ${product.category} ${product.material}`.toLowerCase().includes(query)).slice(0,6);
    if(!query){results.innerHTML="<p class='search-empty'>Начните вводить название товара.</p>";return;}
    if(!found.length){results.innerHTML="<p class='search-empty'>Ничего не найдено.</p>";return;}
    results.innerHTML=found.map(product=>`<a class="search-result" href="product.html?id=${product.id}">
      <img src="${product.image}" alt="${product.name}">
      <div><small>${product.category}</small><strong>${product.name}</strong><span>${formatPrice(product.price)}</span></div>
    </a>`).join("");
  }));

  const update=state=>{
    const wish=state.wishlist.length;
    const cart=state.cart.reduce((sum,item)=>sum+item.quantity,0);
    document.querySelectorAll("[data-wishlist-count]").forEach(el=>{el.textContent=wish;el.hidden=!wish;});
    document.querySelectorAll("[data-cart-count]").forEach(el=>{el.textContent=cart;el.hidden=!cart;});
  };
  store.subscribe(update);
  update(store.getState());
}
