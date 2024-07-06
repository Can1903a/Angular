import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {



  constructor(private http: HttpClient, private envService: EnvironmentService) { }

  getCategories(): Observable<any> {
    const url = this.envService.getCategoriesUrl();
    return this.http.get<any>(url);
  }

  getUpperCategories(): Observable<any> {
    return this.http.get(this.envService.getUpperCategoriesUrl());
  }

  getSubcategories(ustKategoriId: number): Observable<any> {
    return this.http.get(this.envService.getSubcategoriesUrl(ustKategoriId));
  }
}
