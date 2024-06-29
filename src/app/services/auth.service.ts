import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { finalize, filter, switchMap, catchError } from 'rxjs/operators';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EnvironmentsService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  REDIRECT_URI = '/login/authenticate';
  private userSessionKey = 'external-user-sessionkey';
  // private jwtService: JwtHelperService;
  private currentSession: BehaviorSubject<any>;
  private authUrl: string;
  private logoutUrl: string;

  get httpOption() { return { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }; }

  constructor(private _loc: Location, private _http: HttpClient, private _env: EnvironmentsService) {
    this.authUrl = this._env.config.authUrl;
    this.logoutUrl = this._env.config.logoutUrl;
    // this.jwtService = new JwtHelperService();
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem(this.userSessionKey));
    } catch (e) { }
    this.currentSession = new BehaviorSubject(session);
  }

  saveCurrentSession(session){
    // session.user = this.jwtService.decodeToken(session.access_token);
    session.user = "admin"
    localStorage.setItem(this.userSessionKey,JSON.stringify(session));
    this.currentSession.next(session);
  }

  getCurrentSession(): BehaviorSubject<any>{
    return this.currentSession
  }

  getRefreshToken() {
    const session = this.currentSession.getValue();
    return session ? session.refresh_token : null;
  }

  getAccessToken() {
    const session = this.currentSession.getValue();
    return session ? session.access_token : null;
  }

  clearCurrentSession(){
    localStorage.removeItem(this.userSessionKey);
    this.currentSession.next(null);
  }
  
  isTokenExpired(token: string) {
    // return this.jwtService.isTokenExpired(token);
    return false;
  }
  
  logIn(){
    let cur = window.location.pathname + window.location.search;
    this.redirectToLogin(cur);
  }

  logout(){
    let cur = window.location.href
    this.clearCurrentSession();
    this.redirectToLogin(cur,'logout');
  }

  redirectToLogin(url:string, type?:string){
    const clientid = this._env.config.authClientId;
    const state = { client_id: clientid, url: url };
    const encoded = btoa(JSON.stringify(state));
    const redirectUri = window.location.origin + this._loc.prepareExternalUrl(this.REDIRECT_URI);
    let params = `response_type=code&client_id=${clientid}&state=${encoded}&redirect_uri=${redirectUri}`;
    let logoutParams = `client_id=${clientid}&redirect_uri=${redirectUri}&state=${encoded}`;
    type != "logout" ? window.location.href = `${this.authUrl}/authorize?${params}`
    :window.location.href = url;
    // :window.location.href = `${this.logoutUrl}?${logoutParams}`;
  }

  //Authentication APIs
  authenticase(code: string, clientId: string, redirectUri: string) {
    let data: any = { grant_type: 'authorization_code', code: code, client_id: clientId, redirect_uri: redirectUri };
    if (!this._env.config.production) data.bypass_uri_check = true;
    return this._http.post(`${this.authUrl}/tokens`, data);
  }

  refreshToken(token: string) {
    let data = { grant_type: 'refresh_token', refresh_token: token };
    return this._http.post(`${this.authUrl}/tokens`, data);
  }

}
