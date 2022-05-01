import {Component, OnInit} from '@angular/core';
import {OrderHistory} from "../../common/order-history";
import {OrderHistoryService} from "../../services/order-history.service";
import {getUserMailFromLocalStorage} from "../../util";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList: OrderHistory[] = [];

  storage: Storage = localStorage;

  constructor(private orderHistoryService: OrderHistoryService) {
  }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  private handleOrderHistory() {
    const userEmail = getUserMailFromLocalStorage();
    if (userEmail) {
      this.orderHistoryService.getOrderHistoryByUserEmail(userEmail).subscribe(
        (data) => this.orderHistoryList = data._embedded.orders
      );
    }

  }
}
