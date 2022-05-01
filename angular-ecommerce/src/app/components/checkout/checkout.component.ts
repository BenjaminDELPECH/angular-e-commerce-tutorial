import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validator, Validators} from "@angular/forms";
import {CartService} from "../../services/cart.service";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {Luv2ShopValidators} from "../../validators/luv2-shop-validators";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import {Address} from "../../common/address";
import {Order} from "../../common/order";
import {getUserMailFromLocalStorage} from "../../util";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  defaultValidators = [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace];

  checkoutFormGroup: FormGroup = this.formBuilder.group({
    customer: this.formBuilder.group({
      firstName: new FormControl('', this.defaultValidators),
      lastName: new FormControl('', this.defaultValidators),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Luv2ShopValidators.notOnlyWhitespace,
        Validators.pattern('(?:[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])')])
    }),
    shippingAddress: this.formBuilder.group({
      street: new FormControl('', this.defaultValidators),
      city: new FormControl('', this.defaultValidators),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', this.defaultValidators),
    }),
    billingAddress: this.formBuilder.group({
      street: new FormControl('', this.defaultValidators),
      city: new FormControl('', this.defaultValidators),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', this.defaultValidators),
    }),
    creditCard: this.formBuilder.group({
      cardType: new FormControl('', [Validators.required]),
      nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), Luv2ShopValidators.notOnlyWhitespace]),
      cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
      securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
      expirationMonth: new FormControl('', [Validators.required]),
      expirationYear: new FormControl('', [Validators.required]),
    })
  })

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];


  countries : Country[] = [];
  billingAdressStates : State[]= [];
  shippingAdressStates : State[] = [];

  storage : Storage = localStorage;

  constructor(private formBuilder: FormBuilder, private cartService: CartService, private shopService: ShopFormService, private checkoutService: CheckoutService, private router: Router) {

  }

  ngOnInit(): void {
    this.updateCartInfos();
    this.reviewCartDetails();


    const userEmail = getUserMailFromLocalStorage();
    if(userEmail){
      const formGroup = this.checkoutFormGroup.get("customer")
      formGroup?.get('email')?.setValue(userEmail);
    }

    const startMonth : number = new Date().getMonth()+1;

    this.shopService.getCreditCardMonths(startMonth).subscribe(data=>{this.creditCardMonths = data;})
    this.shopService.getCreditCardYears().subscribe(data=>{this.creditCardYears = data;})

    this.shopService.getCountries().subscribe(data=> this.countries = data)


  }

  reviewCartDetails(){
    this.cartService.totalPrice.subscribe(data=>this.totalPrice = data)
    this.cartService.totalQuantity.subscribe(data=>this.totalQuantity = data)
  }

  getState(formName:string){
    const formGroup = this.checkoutFormGroup.get(formName)
    const countryCode = formGroup?.value.country.code;

     this.shopService.getStateByCountryCode(countryCode).subscribe(
       data=>{
         if(formName==='shippingAddress'){
           this.shippingAdressStates = data
         }else{
           this.billingAdressStates = data;
         }
         //select first item by default
         formGroup?.get('state')?.setValue(data[0])
       }
     )



  }

  onSubmit() {
    console.log("Handling the submit button");

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order(this.totalPrice, this.totalQuantity);

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();

    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    if(purchase.shippingAddress) {
      const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;
    }

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    if(purchase!= null && purchase.billingAddress!=null) {
      const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
      const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;
    }

    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // call REST API via the CheckoutService
    this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );

  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear : number = new Date().getFullYear();
    if(creditCardFormGroup!=null) {
      const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
      let startMonth : number;
      if(currentYear==selectedYear){
        startMonth = new Date().getMonth()+1;
      }else{
        startMonth  =1;
      }
      this.shopService.getCreditCardMonths(startMonth).subscribe(
        data=>{
          this.creditCardMonths = data;
        }
      )
    }
  }

  updateCartInfos() {
    this.cartService.computeCartTotals();
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event != null && event.target != null && event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAdressStates = this.shippingAdressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAdressStates = [];
    }
  }

  get firstName(){
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName(){
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email(){return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode')}

  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode')}

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType')}
  get nameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard')}
  get cardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber')}
  get securityCode(){return this.checkoutFormGroup.get('creditCard.securityCode')}
  get expirationMonth(){return this.checkoutFormGroup.get('creditCard.expirationMonth')}
  get expirationYear(){return this.checkoutFormGroup.get('creditCard.expirationYear')}

  private resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form
    this.checkoutFormGroup.reset();

    //navigate back to the products page
    this.router.navigateByUrl("/products");

  }
}
