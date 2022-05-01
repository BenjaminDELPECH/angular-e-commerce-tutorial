import {Component, Inject, OnInit} from '@angular/core';


import {Router} from "@angular/router";
import {OKTA_AUTH, OktaAuthStateService} from "@okta/okta-angular";
import {AuthState, OktaAuth, UserClaims} from "@okta/okta-auth-js";


@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated : boolean | undefined = false;
  userFullName : string | undefined = "";
  storage: Storage = localStorage;

  constructor(public oktaAuthStateService: OktaAuthStateService, public router: Router,  @Inject(OKTA_AUTH) private oktaAuth: OktaAuth){
   this.oktaAuthStateService.authState$.subscribe(
      (result:AuthState)=>{
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails()
      }
    );

  }

   async ngOnInit() {
     const isAuthenticated = await this.oktaAuth.isAuthenticated();
     if (isAuthenticated) {
       const userClaims = await this.oktaAuth.getUser();
     }
  }

  private getUserDetails() {
    if(this.isAuthenticated){
      this.oktaAuth.getUser().then(
        (res:UserClaims)=>{
          this.userFullName = res.name;
          this.storage.setItem("userMail", JSON.stringify(res.email));
        }
      )
    }
  }

  logout(){
    this.oktaAuth.signOut();
  }
}
