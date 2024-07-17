import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl: string;
  private registerUrl: string;
  private loggedIn = new BehaviorSubject<boolean>(this.kontrol());
  private isAdminSubject = new BehaviorSubject<boolean>(this.getAdminStatus());

  constructor(private http: HttpClient, private router: Router, private envService: EnvironmentService) {
    this.loginUrl = this.envService.getLoginUrl();
    this.registerUrl = this.envService.getRegisterUrl();
  }

  private kontrol(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  private getAdminStatus(): boolean {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin === 'true';
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.registerUrl}`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.loginUrl}`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('isAdmin', response.customer.isAdmin.toString());
          this.loggedIn.next(true);
          this.isAdminSubject.next(response.customer.isAdmin);

          this.isAdminSubject.subscribe(isAdmin => {
            if (isAdmin) {
              this.router.navigateByUrl('/admin', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/admin']);
              });
            } else {
              this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/home']);
              });
            }
          });
        }
      })
    );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('isAdmin');
    }
    this.loggedIn.next(false);
    this.isAdminSubject.next(false);
    this.router.navigate(['/home']);
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
}
