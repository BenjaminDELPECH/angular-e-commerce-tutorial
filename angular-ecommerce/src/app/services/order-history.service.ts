import {Injectable} from '@angular/core';
import {OrderHistory} from "../common/order-history";
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {


  private orderHistoryUrl = 'http://localhost:8098/api/orders';


  constructor(private httpClient: HttpClient) {

  }

  getOrderHistoryByUserEmail(userEmail: string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = `${this.orderHistoryUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${userEmail}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }

}

export interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[]
  }
}
