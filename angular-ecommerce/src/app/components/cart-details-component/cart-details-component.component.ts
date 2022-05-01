import { Component, OnInit } from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-details-component',
  templateUrl: './cart-details-component.component.html',
  styleUrls: ['./cart-details-component.component.css']
})
export class CartDetailsComponentComponent implements OnInit {
  totalPrice : number = 0;
  totalQuantity : number = 0;
  cartItems: CartItem[] = [];

  constructor(private cartService : CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){
    this.cartItems = this.cartService.cartItems;
    this.cartService.totalPrice.subscribe(
      data=> this.totalPrice = data
    )

    this.cartService.totalPrice.subscribe(
      data=> this.totalPrice = data
    )

    this.cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem:CartItem){
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem){
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem : CartItem){
    this.cartService.remove(theCartItem);
  }



}
