import {environment} from "../../environments/environment";

/*
const oktatestingDisableHttpsCheck = environment.production === false;
const USE_INTERACTION_CODE = false;
*/


export default {
  oidc: {
    clientId: '0oa4ux46yzLFBRXoC5d7',
    issuer: 'https://dev-41942346.okta.com/oauth2/default',
    redirectUri: 'https://localhost:4200/login/callback',
    scopes: ['openid', 'profile', 'email']
  }
};

