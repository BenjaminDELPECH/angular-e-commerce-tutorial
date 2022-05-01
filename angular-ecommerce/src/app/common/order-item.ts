import {CartItem} from "./cart-item";

export class OrderItem {
  imageUrl:string;
  unitPrice:number;
  quantity:number;
  productId:string;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.unitPrice = cartItem.quantity;
    this.quantity = cartItem.unitPrice;
    this.productId = cartItem.id;
  }
}
