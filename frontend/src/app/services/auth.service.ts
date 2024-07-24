  import { Injectable } from '@angular/core';
  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { BehaviorSubject, Observable, tap } from 'rxjs';
  import { Router } from '@angular/router';
  import { EnvironmentService } from './environment.service';
  import { isBrowser} from '../../../helpers'
  @Injectable({
    providedIn: 'root'
  })
  export class AuthService {

    private loginUrl: string;
    private registerUrl: string;
    private loggedIn = new BehaviorSubject<boolean>(this.control());
    private isAdminSubject = new BehaviorSubject<boolean>(this.getAdminStatus());

    constructor(private http: HttpClient, private router: Router, private envService: EnvironmentService) {
      this.loginUrl = this.envService.getLoginUrl();
      this.registerUrl = this.envService.getRegisterUrl();
    }

    private isBrowser(): boolean {
      return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
    }

    public control(): boolean {
      return this.isBrowser() && !!localStorage.getItem('token');
    }

    private getAdminStatus(): boolean {
      if (this.isBrowser()) {
        const isAdmin = localStorage.getItem('isAdmin');
        return isAdmin === 'true';
      }
      return false;
    }

    register(user: any): Observable<any> {
      return this.http.post(`${this.registerUrl}`, user);
    }

    login(credentials: any): Observable<any> {
      return this.http.post(`${this.loginUrl}`, credentials).pipe(
        tap((response: any) => {
          if (response.token) {
            if (this.isBrowser()) {
              localStorage.setItem('token', response.token);
              localStorage.setItem('isAdmin', response.customer.isAdmin.toString());
            }
            this.loggedIn.next(true);
            this.isAdminSubject.next(response.customer.isAdmin);

            if (response.customer.isAdmin) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/home']);
            }
          }
        })
      );
    }


    logout() {
      if (this.isBrowser()) {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
      }
      this.loggedIn.next(false);
      this.isAdminSubject.next(false);
      this.router.navigate(['/']);
    }

    get isLoggedIn(): Observable<boolean> {
      return this.loggedIn.asObservable();
    }

    get isAdmin(): Observable<boolean> {
      return this.isAdminSubject.asObservable();
    }

    checkAdminStatus(): boolean {
      return this.isAdminSubject.getValue();
    }

    addTokenToHeaders(): HttpHeaders {
      const token = this.isBrowser() ? localStorage.getItem('token') : '';
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }

    isTokenExpired(): boolean {
      if (this.isBrowser()) {
        const token = localStorage.getItem('token');
        if (token) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const expiry = payload.exp * 1000;
          return Date.now() >= expiry;
        }
      }
      return true;
    }

    checkTokenExpiry(): void {
      if (this.isTokenExpired()) {
        this.logout();
      }
    }
    getToken(): string | null {
      return this.isBrowser() ? localStorage.getItem('token') : null;
    }
  }
