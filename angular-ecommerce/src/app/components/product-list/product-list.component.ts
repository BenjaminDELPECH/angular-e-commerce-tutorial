import {Component, OnInit} from '@angular/core';
import {GetResponseProductList, ProductService} from "../../services/product.service";
import {Product} from "../../common/product";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  pageNumber: number = 1;
  pageSize: number = 5;
  totalPage: number = 0;
  totalElements: number = 0;

  products: Product[] = [];

  previousCategoryId: number = 1;
  currentCategoryId: number = 1;
  currentCategoryName: string = "";

  previousKeyword: string = "";
  searchMode: boolean = false;

  constructor(private productListService: ProductService, private route: ActivatedRoute, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    })
  }

  listProducts() {

    // let theKeyword = this.route.snapshot.paramMap.get("keyword")
    this.searchMode = this.route.snapshot.paramMap.has("keyword")
    if (this.searchMode) {
      this.handleSearchProducts()
    } else {
      this.handleListProducts()
    }


  }

  updatePageSize() {
    this.pageNumber = 1;
    this.listProducts();
  }

  handleSearchProducts() {
    let theKeyword = this.route.snapshot.paramMap.get("keyword")
    if (theKeyword != null) {

      if (theKeyword != this.previousKeyword) {
        this.pageNumber = 1;
      }

      this.previousKeyword = theKeyword;

      this.productListService.getProductByNamePaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId, theKeyword).subscribe(
        this.copyDataToComponent()
      )
    }
  }

  changePage() {
    this.listProducts();
  };

  handleListProducts() {
    //check if "id" paramter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");
    if (hasCategoryId && this.route.snapshot.paramMap.get("id") != null) {
      let categoryId = this.route.snapshot.paramMap!.get("id");
      let categoryName = this.route.snapshot.paramMap!.get("name");
      if (categoryId != null && categoryName) {
        this.currentCategoryId = +categoryId;
      }

      if (categoryName != null && categoryName) {
        this.currentCategoryName = categoryName;
      }
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;

    this.productListService.getProductListPaginate(this.pageNumber - 1, this.pageSize, this.currentCategoryId).subscribe(
      this.copyDataToComponent()
    )

  }

  addToCart(product:Product){
    const newCartItem = new CartItem(product)
    this.cartService.addToCart(newCartItem)
  }

  private copyDataToComponent() {
    return (data: GetResponseProductList) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.totalPage = data.page.totalPages;
      this.totalElements = data.page.totalElements;
    }
  }
}
