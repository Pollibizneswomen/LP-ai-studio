import{formatPrice}from"../core/utils.js";
import{store}from"../core/store.js";
import{showToast}from"./toast.js";
export function template(product){
  const liked=store.getState().wishlist.includes(product.id);
  return `<article class="product-card" data-product-id="${product.id}">
    <a class="product-card__media" href="product.html?id=${product.id}">
      ${product.badge?`<span class="product-card__badge">${product.badge}</span>`:""}
      <img src="${product.image}" alt="${product.name}" loading="lazy">
    </a>
    <button class="icon-button product-card__wishlist ${liked?"is-active":""}" data-wishlist aria-label="Избранное">
      <svg><use href="assets/icons/sprite.svg#heart"></use></svg>
    </button>
    <div class="product-card__body">
      <div class="product-card__top">
        <div><p>${product.category}</p><h3><a href="product.html?id=${product.id}">${product.name}</a></h3></div>
        <span>★ ${product.rating}</span>
      </div>
      <p class="product-card__material">${product.material}</p>
      <div class="product-card__bottom">
        <div><strong>${formatPrice(product.price)}</strong>${product.oldPrice?`<del>${formatPrice(product.oldPrice)}</del>`:""}</div>
        <button class="button button--compact button--dark" data-add-cart>В корзину</button>
      </div>
    </div>
  </article>`;
}
export function bind(container){
  container.addEventListener("click",event=>{
    const card=event.target.closest("[data-product-id]");
    if(!card)return;
    const id=card.dataset.productId;
    if(event.target.closest("[data-wishlist]")){
      event.preventDefault();
      const added=store.toggleWishlist(id);
      event.target.closest("[data-wishlist]").classList.toggle("is-active",added);
      showToast(added?"Добавлено в избранное":"Удалено из избранного");
    }
    if(event.target.closest("[data-add-cart]")){
      event.preventDefault();
      store.addToCart(id);
      showToast("Товар добавлен в корзину");
    }
  });
}
