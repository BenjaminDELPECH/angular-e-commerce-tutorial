import {Component, Inject, OnInit} from '@angular/core';

// @ts-ignore
import * as OktaSignIn from '@okta/okta-signin-widget';
import myAppConfig from "../../config/my-app-config";
import {OktaAuth, Tokens} from "@okta/okta-auth-js";
import {OKTA_AUTH} from "@okta/okta-angular";

const DEFAULT_ORIGINAL_URI = window.location.origin;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signIn:any;

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.signIn = new OktaSignIn({
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0],
      clientId : myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      logo : 'assets/angular.svg',
      authClient : oktaAuth
    })

  }

  ngOnInit(): void {
    const originalUri = this.oktaAuth.getOriginalUri()
    if(!originalUri || originalUri == DEFAULT_ORIGINAL_URI){
      this.oktaAuth.setOriginalUri('/')
    }
    this.signIn.showSignInToGetTokens({
      el :'#okta-sign-in-widget',
      scopes: myAppConfig.oidc.scopes
    }).then((tokens:Tokens)=>{
      this.signIn.remove();

      // In this flow the redirect to Okta occurs in a hidden iframe
      this.oktaAuth.handleLoginRedirect(tokens);
    }).catch((err:any)=>{
      throw err;
    })
  }

}
