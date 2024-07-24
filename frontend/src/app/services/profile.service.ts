import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { User } from '../user/profile/profile.component';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUrl: string;
  private changePasswordUrl: string;


  constructor(private http: HttpClient, private envService: EnvironmentService) {
    this.profileUrl = this.envService.getProfileUrl();
    this.changePasswordUrl = this.envService.getChangePasswordUrl();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (token) {
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    } else {
      return new HttpHeaders();
    }
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(this.profileUrl, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(this.changePasswordUrl,
      { currentPassword, newPassword },
      {
        headers: this.getAuthHeaders()
      }
    );
  }
}

