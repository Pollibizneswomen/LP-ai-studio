import{loadState,saveState}from"./storage.js";
class Store{
  #state=loadState();
  #listeners=new Set();
  getState(){return structuredClone(this.#state);}
  subscribe(fn){this.#listeners.add(fn);return()=>this.#listeners.delete(fn);}
  #commit(state){this.#state=state;saveState(state);this.#listeners.forEach(fn=>fn(this.getState()));}
  toggleWishlist(id){
    const exists=this.#state.wishlist.includes(id);
    const wishlist=exists?this.#state.wishlist.filter(x=>x!==id):[...this.#state.wishlist,id];
    this.#commit({...this.#state,wishlist});
    return !exists;
  }
  addToCart(id,qty=1){
    const cart=[...this.#state.cart];
    const index=cart.findIndex(item=>item.productId===id);
    if(index>=0)cart[index]={...cart[index],quantity:cart[index].quantity+qty};
    else cart.push({productId:id,quantity:qty});
    this.#commit({...this.#state,cart});
  }
  updateQuantity(id,qty){
    const quantity=Math.max(1,Number(qty)||1);
    this.#commit({...this.#state,cart:this.#state.cart.map(item=>item.productId===id?{...item,quantity}:item)});
  }
  removeFromCart(id){this.#commit({...this.#state,cart:this.#state.cart.filter(item=>item.productId!==id)});}
  clearCart(){this.#commit({...this.#state,cart:[]});}
}
export const store=new Store();
