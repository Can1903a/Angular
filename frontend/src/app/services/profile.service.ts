import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { User } from '../components/profile/profile.component';
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
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      return new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
    }
    return new HttpHeaders();
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/profile/change-password`,
      { currentPassword, newPassword },
      {
        headers: this.getAuthHeaders()
      }
    );
  }
}
