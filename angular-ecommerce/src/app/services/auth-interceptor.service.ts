import {Inject, Injectable} from '@angular/core';
import {OktaAuth} from "@okta/okta-auth-js";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {from, lastValueFrom, Observable, of} from "rxjs";
import {OKTA_AUTH} from "@okta/okta-angular";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
 /*   return next.handle(req);*/
    return from(this.handleAccess(req, next));
  }


  private async handleAccess(request: HttpRequest<any>, next: HttpHandler) : Promise<HttpEvent<any>>{
    const accessToken = await this.oktaAuth.getAccessToken();
    if(accessToken){
      request = request.clone({
        setHeaders:{
          Authorization : `Bearer `+accessToken,
        }
      });
    }
    return lastValueFrom(next.handle(request));
  }
}
