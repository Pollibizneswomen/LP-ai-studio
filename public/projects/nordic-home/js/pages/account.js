import { PRODUCTS } from '../data/products.js';
import { store } from '../core/store.js';
import { formatPrice } from '../core/utils.js';
import { showToast } from '../components/toast.js';

const KEY='nordic-home-account';
const defaults={
 profile:{name:'Полина',surname:'Иванова',email:'polina@example.com',phone:'+7 900 000-00-00',birthday:'2003-05-18'},
 addresses:[{id:1,title:'Дом',city:'Калининград',street:'ул. Примерная, 12',flat:'45',postcode:'236000',primary:true}],
 settings:{orders:true,promos:true,collections:true,sms:false,language:'Русский',currency:'RUB'},
 notifications:[
  {id:1,title:'Заказ передан в доставку',text:'Заказ NH-24071 скоро будет у вас.',date:'Сегодня, 12:40',read:false,type:'order'},
  {id:2,title:'Новая коллекция Soft Forms',text:'Спокойные формы и натуральные материалы уже в каталоге.',date:'Вчера, 18:10',read:false,type:'collection'},
  {id:3,title:'Персональная подборка',text:'Мы сохранили 6 предметов, которые сочетаются с вашим избранным.',date:'25 июля',read:true,type:'idea'}
 ],
 orders:[
  {id:'NH-24071',date:'24 июля 2026',status:'В пути',total:151800,items:[{id:'aurora',qty:1},{id:'saga',qty:1}]},
  {id:'NH-23804',date:'2 июня 2026',status:'Доставлен',total:69900,items:[{id:'nora',qty:1}]},
  {id:'NH-23152',date:'14 марта 2026',status:'Доставлен',total:45900,items:[{id:'luna',qty:1}]}
 ]
};
let data=load();
let active='overview';

function load(){try{return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
const $=(s)=>document.querySelector(s);
const product=id=>PRODUCTS.find(p=>p.id===id);

function setActive(section){
 active=section;
 document.querySelectorAll('[data-account-section]').forEach(el=>el.hidden=el.dataset.accountSection!==section);
 document.querySelectorAll('[data-account-nav]').forEach(el=>el.classList.toggle('is-active',el.dataset.accountNav===section));
 const title={overview:'Обзор',orders:'Мои заказы',wishlist:'Избранное',addresses:'Адреса доставки',profile:'Профиль',settings:'Настройки',notifications:'Уведомления'}[section];
 $('[data-page-title]').textContent=title;
 history.replaceState({},'',`#${section}`);
 if(section==='wishlist')renderWishlist();
 if(section==='orders')renderOrders();
 if(section==='addresses')renderAddresses();
 if(section==='notifications')renderNotifications();
}

function renderOverview(){
 const wishlistCount=store.getState().wishlist.length;
 $('[data-stat-orders]').textContent=data.orders.length;
 $('[data-stat-wishlist]').textContent=wishlistCount;
 $('[data-stat-addresses]').textContent=data.addresses.length;
 $('[data-user-name]').textContent=data.profile.name;
 $('[data-user-email]').textContent=data.profile.email;
 const latest=data.orders[0];
 const box=$('[data-latest-order]');
 box.innerHTML=`<div class="account-order-head"><div><span>Заказ ${latest.id}</span><strong>${latest.status}</strong></div><b>${formatPrice(latest.total)}</b></div><div class="mini-products">${latest.items.map(i=>{const p=product(i.id);return `<a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"><span>${p.name}</span></a>`}).join('')}</div><button class="button button--outline" data-go="orders">Подробнее</button>`;
}

function renderOrders(){
 $('[data-orders]').innerHTML=data.orders.map(order=>`<article class="account-order-card"><div class="account-order-head"><div><small>${order.date}</small><h3>Заказ ${order.id}</h3></div><span class="status status--${order.status==='Доставлен'?'done':'route'}">${order.status}</span></div><div class="order-products">${order.items.map(i=>{const p=product(i.id);return `<a href="product.html?id=${p.id}" class="order-product"><img src="${p.image}" alt="${p.name}"><div><strong>${p.name}</strong><span>${i.qty} шт. · ${formatPrice(p.price)}</span></div></a>`}).join('')}</div><div class="account-order-foot"><strong>${formatPrice(order.total)}</strong><div><button class="button button--outline" data-repeat="${order.id}">Повторить заказ</button><button class="button button--ghost">Документы</button></div></div></article>`).join('');
}

function renderWishlist(){
 const ids=store.getState().wishlist;
 const root=$('[data-wishlist-grid]');
 if(!ids.length){root.innerHTML='<div class="account-empty"><h3>В избранном пока пусто</h3><p>Сохраняйте предметы, чтобы вернуться к ним позже.</p><a class="button button--dark" href="catalog.html">Перейти в каталог</a></div>';return;}
 root.innerHTML=ids.map(id=>{const p=product(id);return `<article class="wish-card" data-wish="${id}"><a href="product.html?id=${id}"><img src="${p.image}" alt="${p.name}"></a><button class="wish-remove" data-remove-wish="${id}" aria-label="Удалить">×</button><div><span>${p.category}</span><h3><a href="product.html?id=${id}">${p.name}</a></h3><strong>${formatPrice(p.price)}</strong><button class="button button--dark" data-wish-cart="${id}">В корзину</button></div></article>`}).join('');
}

function renderAddresses(){
 $('[data-addresses]').innerHTML=data.addresses.map(a=>`<article class="address-card ${a.primary?'is-primary':''}"><div><span>${a.primary?'Основной адрес':a.title}</span><h3>${a.city}</h3><p>${a.street}${a.flat?', кв. '+a.flat:''}<br>${a.postcode}</p></div><div class="address-actions">${!a.primary?`<button data-primary-address="${a.id}">Сделать основным</button>`:''}<button data-delete-address="${a.id}">Удалить</button></div></article>`).join('')+`<button class="address-add" data-open-address>+ Добавить адрес</button>`;
}

function renderNotifications(){
 $('[data-notifications]').innerHTML=data.notifications.map(n=>`<article class="notification-card ${n.read?'':'is-unread'}" data-notification="${n.id}"><div class="notification-icon">${n.type==='order'?'□':n.type==='collection'?'◇':'✦'}</div><div><h3>${n.title}</h3><p>${n.text}</p><small>${n.date}</small></div><button data-read="${n.id}">${n.read?'Прочитано':'Отметить прочитанным'}</button></article>`).join('');
 const unread=data.notifications.filter(n=>!n.read).length;
 $('[data-notification-count]').textContent=unread;
 $('[data-notification-count]').hidden=!unread;
}

function populateForms(){
 const p=data.profile;
 for(const [k,v] of Object.entries(p)){const el=document.querySelector(`[name="${k}"]`);if(el)el.value=v;}
 const s=data.settings;
 for(const [k,v] of Object.entries(s)){const el=document.querySelector(`[name="${k}"]`);if(el) el.type==='checkbox'?el.checked=v:el.value=v;}
}

function bind(){
 document.addEventListener('click',e=>{
  const nav=e.target.closest('[data-account-nav]'); if(nav){setActive(nav.dataset.accountNav);return;}
  const go=e.target.closest('[data-go]'); if(go){setActive(go.dataset.go);return;}
  const repeat=e.target.closest('[data-repeat]'); if(repeat){const o=data.orders.find(x=>x.id===repeat.dataset.repeat);o.items.forEach(i=>store.addToCart(i.id,i.qty));showToast('Товары добавлены в корзину');return;}
  const rm=e.target.closest('[data-remove-wish]'); if(rm){store.toggleWishlist(rm.dataset.removeWish);renderWishlist();renderOverview();return;}
  const wc=e.target.closest('[data-wish-cart]'); if(wc){store.addToCart(wc.dataset.wishCart,1);showToast('Товар добавлен в корзину');return;}
  const primary=e.target.closest('[data-primary-address]'); if(primary){data.addresses.forEach(a=>a.primary=a.id===Number(primary.dataset.primaryAddress));save();renderAddresses();return;}
  const del=e.target.closest('[data-delete-address]'); if(del){data.addresses=data.addresses.filter(a=>a.id!==Number(del.dataset.deleteAddress));if(data.addresses.length&&!data.addresses.some(a=>a.primary))data.addresses[0].primary=true;save();renderAddresses();renderOverview();return;}
  if(e.target.closest('[data-open-address]')){$('[data-address-dialog]').showModal();return;}
  const read=e.target.closest('[data-read]'); if(read){const n=data.notifications.find(x=>x.id===Number(read.dataset.read));n.read=true;save();renderNotifications();return;}
  if(e.target.closest('[data-read-all]')){data.notifications.forEach(n=>n.read=true);save();renderNotifications();return;}
  if(e.target.closest('[data-logout]')){showToast('Это демонстрационный кабинет — выход не требуется');}
 });

 $('[data-profile-form]').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);data.profile=Object.fromEntries(fd.entries());save();renderOverview();showToast('Профиль сохранён');});
 $('[data-settings-form]').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);data.settings={orders:fd.has('orders'),promos:fd.has('promos'),collections:fd.has('collections'),sms:fd.has('sms'),language:fd.get('language'),currency:fd.get('currency')};save();showToast('Настройки сохранены');});
 $('[data-address-form]').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const a=Object.fromEntries(fd.entries());a.id=Date.now();a.primary=data.addresses.length===0;data.addresses.push(a);save();renderAddresses();renderOverview();e.currentTarget.reset();$('[data-address-dialog]').close();showToast('Адрес добавлен');});
 $('[data-close-address]').addEventListener('click',()=> $('[data-address-dialog]').close());
}

export function initAccount(){
 renderOverview();renderOrders();renderWishlist();renderAddresses();renderNotifications();populateForms();bind();
 const hash=location.hash.slice(1);setActive(['overview','orders','wishlist','addresses','profile','settings','notifications'].includes(hash)?hash:'overview');
 store.subscribe(()=>{renderOverview();if(active==='wishlist')renderWishlist();});
}
