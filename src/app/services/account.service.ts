import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { EnvironmentsService } from "./environment.service";

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;
    
    constructor(
        private router: Router,
        private http: HttpClient,
        private environmentsService:EnvironmentsService
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        return this.userSubject.value;
    }
    getCurrentUser(): BehaviorSubject<User>{
        return this.userSubject;
    }

    hasRole(roles){
        if(this.userSubject.value !=null){
            return roles.indexOf(this.userSubject.value.role.name) > -1;    
        }else{
            return false;
        }
    }
    getUser(){        
        if(localStorage.getItem("user")){
            var obj = JSON.parse(localStorage.getItem("user"));
        }
        return obj;
    }
    isAuthorized(role) {
        if(role == undefined){
          return true;
        }else{
          return this.hasRole(role);
        }
    }
    login(username, password) {
        return this.http.post<User>(`${this.environmentsService.config.posServiceUrl}/login`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
                this.userSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        // this.router.navigateByUrl('/');
        this.router.navigate(['/']);
    }

    register(user: User) {
        return this.http.post(`${this.environmentsService.config.posServiceUrl}/users/register`, user);
    }

    getAll() {
        return this.http.get<User[]>(`${this.environmentsService.config.posServiceUrl}/users`);
    }

    getById(id: string) {
        return this.http.get<User>(`${this.environmentsService.config.posServiceUrl}/users/${id}`);
    }

    update(id, params) {
        return this.http.put(`${this.environmentsService.config.posServiceUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${this.environmentsService.config.posServiceUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}