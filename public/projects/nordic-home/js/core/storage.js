const KEY="nordic-home-state-v1";
const EMPTY={wishlist:[],cart:[]};
export function loadState(){
  try{
    const parsed=JSON.parse(localStorage.getItem(KEY));
    return {
      wishlist:Array.isArray(parsed?.wishlist)?parsed.wishlist:[],
      cart:Array.isArray(parsed?.cart)?parsed.cart:[]
    };
  }catch{return structuredClone(EMPTY);}
}
export function saveState(state){localStorage.setItem(KEY,JSON.stringify(state));}
