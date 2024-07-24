  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { EnvironmentService } from './environment.service';
  import { User } from '../user/profile/profile.component';

  @Injectable({
    providedIn: 'root'
  })
  export class UserService {
    private adminUrl = this.envService;

    constructor( private http: HttpClient ,  private envService: EnvironmentService) {}

    getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.envService.getUserProfilesUrl());
    }
  }
