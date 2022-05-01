import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product: Product | undefined;
  productId : number = -1;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService:CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.fetchProduct();
    })
  }

  addToCart(product :Product){
    const newCartItem = new CartItem(product)
    this.cartService.addToCart(newCartItem)
  }

  fetchProduct():void{
    let hasProductId = this.route.snapshot.paramMap.get("id")
    if(hasProductId){
      let productId = this.route.snapshot.paramMap.get("id")
      if(productId!= null){
        this.productId = +productId;
      }
    }
    if(this.productId!=-1){
      this.productService.getProduct(this.productId).subscribe(
        data=>{
          this.product = data
        }
      )
    }

  }

}
