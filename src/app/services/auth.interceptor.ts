import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { filter, switchMap, take, finalize, catchError, tap, timeout } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  refreshingToken: boolean;

  constructor(private _auth: AuthService, private _router: Router,) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf("ShopAdd") !== -1) {
      if (this.refreshingToken) {
        console.log("Hold request till refreshing token : " + req.url);
        return this._auth.getCurrentSession().pipe(
          tap(session => console.log("getCurrentSession:" + (session && session.access_token ? "valid accesstoken" : "no accesstoken"))),
          filter(session => session !== null),
          take(1),
          switchMap((session) => next.handle(this.addAuthorization(req, session?.access_token))),
          catchError(error => {
            console.log("Error while refreshing a token " + error)
            this._auth.redirectToLogin(this._router.url);
            return throwError(error)
          })
        )
      }
      const accessToken = this._auth.getAccessToken();
      if (!accessToken) {
        console.log("Hold request till refreshing token : " + req.url);
        return next.handle(req)
      }
      if (this._auth.isTokenExpired(accessToken)) {
        console.log("Access Token is expired. Trying to refresh token...");
        this.refreshingToken = true;
        const refreshToken = this._auth.getRefreshToken();
        this._auth.clearCurrentSession();
        return this._auth.refreshToken(refreshToken).pipe(
          timeout(10000),
          finalize(() => {
            console.log("authService.refreshToken received")
            this.refreshingToken = false
          }),
          switchMap(
            (session: any) => {
              console.log("Refreshed token ...")
              this._auth.saveCurrentSession(session);
              return next.handle(this.addAuthorization(req, session.access_token));
            }
          ),
          catchError(error => {
            console.log("Error while refreshing a token " + error)
            this._auth.redirectToLogin(this._router.url);
            return throwError(error);
          }),
          finalize(() => {
            console.log("authService.refreshToken completed")
            this.refreshingToken = false
          }
          ),
        )
      } else {
        return next.handle(this.addAuthorization(req, accessToken))
      }
    } else {
      return next.handle(req);
    }
  }

  addAuthorization(req: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `${accessToken}` } });
  }
}
