import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, repeat} from "rxjs";
import {Product} from "../common/product";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'http://localhost:8098/api/products';
  private categoryUrl = 'http://localhost:8098/api/product-category';

  constructor(private httpClient: HttpClient) {
  }

  getProductList(categoryId: number): Observable<Product[]> {

    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.httpClient.get<GetResponseProductList>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductByNamePaginate(thePage:number,thePageSize:number, theCategoryId:number, name: string): Observable<GetResponseProductList> {
    const searchUrl = `${this.productsUrl}/search/findProductByNameContaining?name=${name}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProductList>(searchUrl).pipe(
      map(response => response)
    )
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProduct(productId: number): Observable<Product> {
    const url = `${this.productsUrl}/${productId}`
    return this.httpClient.get<Product>(url).pipe(
      map(response => response)
    )
  }

  getProductListPaginate(thePage: number,
                         thePageSize: number,
                         theCategoryId: number): Observable<GetResponseProductList> {
    const url = `${this.productsUrl}/search/findByCategoryId` + `?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProductList>(url).pipe(
      map(response => response)
    );
  }
}


export interface GetResponseProductList {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
