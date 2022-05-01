import {Customer} from "./customer";
import {Address} from "./address";
import {OrderItem} from "./order-item";
import {Order} from "./order";

export class Purchase {
  customer:Customer | null = null;
  shippingAddress:Address | null = null ;
  billingAddress:Address | null = null;
  order:Order | null = null;
  orderItems: OrderItem[] | null = null;



}
