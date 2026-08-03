import{PRODUCTS}from"../data/products.js";
import{template,bind}from"../components/product-card.js";
export function initHome(){
  const grid=document.querySelector("[data-products]");
  grid.innerHTML=PRODUCTS.map(template).join("");
  bind(grid);
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
  }),{threshold:.12});
  document.querySelectorAll("[data-reveal]").forEach(el=>observer.observe(el));
}
