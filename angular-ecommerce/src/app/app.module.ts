import {Injector, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ProductListComponent} from './components/product-list/product-list.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";
import {Routes, RouterModule, Router} from "@angular/router";
import {ProductCategoryMenuComponent} from './components/product-category-menu/product-category-menu.component';
import {SearchComponent} from './components/search/search.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CartStatusComponent} from './components/cart-status/cart-status.component';
import {CartDetailsComponentComponent} from './components/cart-details-component/cart-details-component.component';
import {CheckoutComponent} from './components/checkout/checkout.component';
import {LoginStatusComponent} from './components/login-status/login-status.component';

import {ProtectedComponentComponent} from './components/protected-component/protected-component.component';
import {
  OKTA_CONFIG,
  OktaAuthModule,
  OktaCallbackComponent,
  OktaAuthGuard, OktaAuthStateService
} from '@okta/okta-angular';
import {OktaAuth} from "@okta/okta-auth-js";
import {LoginComponent} from './components/login/login.component';
import {APP_BASE_HREF, HashLocationStrategy, LocationStrategy, PathLocationStrategy} from "@angular/common";
import {environment} from "../environments/environment";
import myAppConfig from "./config/my-app-config";
import {MembersComponent} from './components/members/members.component';
import {OrderHistoryComponent} from './components/order-history/order-history.component';
import {AuthInterceptorService} from "./services/auth-interceptor.service";


const routes: Routes = [
  {
    path: 'login/callback', component: OktaCallbackComponent
  },
  {path: 'login', component: LoginComponent},
  {path: 'members', component: MembersComponent, canActivate: [OktaAuthGuard]},
  {path: 'orders', component: OrderHistoryComponent, canActivate: [OktaAuthGuard]},


  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:id', component: ProductListComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'category/:id/:name', component: ProductListComponent},
  {path: 'products/:id', component: ProductDetailsComponent},
  {path: 'cart-details', component: CartDetailsComponentComponent},
  {path: 'category', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch: 'full'},
  {path: '**', redirectTo: '/products', pathMatch: 'full'},
];


@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponentComponent,
    CheckoutComponent,
    LoginStatusComponent,
    ProtectedComponentComponent,
    LoginComponent,
    MembersComponent,
    OrderHistoryComponent,


  ],
  imports: [
    RouterModule.forRoot(routes,  { enableTracing: true }),
    BrowserModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    OktaAuthModule

  ],
  providers: [
    ProductService, {
      provide: OKTA_CONFIG,
      useFactory: () => {
        const oktaAuth = new OktaAuth(myAppConfig.oidc);
        return {
          oktaAuth,
          onAuthRequired: (oktaAuth: OktaAuth, injector: Injector) => {
            const router = injector.get(Router);
            // Redirect the user to your custom login page
            router.navigate(['/login']);
          }
        }
      }
    },
    {provide: APP_BASE_HREF, useValue: environment.appBaseHref},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide:LocationStrategy, useClass:PathLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
