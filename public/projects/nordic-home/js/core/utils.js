export const qs=(s,p=document)=>p.querySelector(s);
export const formatPrice=n=>new Intl.NumberFormat("ru-RU").format(n)+" ₽";
export function debounce(fn,delay=160){let timer;return(...args)=>{clearTimeout(timer);timer=setTimeout(()=>fn(...args),delay);};}
export function lockScroll(value){document.documentElement.classList.toggle("is-locked",value);}
