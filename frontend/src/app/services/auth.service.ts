import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl : string;
  private registerUrl : string;

  private loggedIn = new BehaviorSubject<boolean>(this.kontrol());

  constructor(private http: HttpClient, private router: Router,
    private envService: EnvironmentService
  ) {
    this.loginUrl = this.envService.getProductsUrl();
    this.registerUrl = this.envService.getProductsUrl();
   }

  private kontrol(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem('token');
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.registerUrl}`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.loginUrl}`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.loggedIn.next(true);
          this.router.navigateByUrl('/home', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/home']);
          });
        }
      })
    );
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.loggedIn.next(false);
    this.router.navigate(['/home']); // Redirect to login page after logout
  }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }
}
