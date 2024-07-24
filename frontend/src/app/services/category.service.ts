import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private http: HttpClient, private envService: EnvironmentService) { }

  getCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/categories`);
  }

  getUpperCategories(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/uppercategories`);
  }

  getSubcategories(ustKategoriId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/subcategories/${ustKategoriId}`);
  }
}

export interface UpperCategory {
  _id: string;
  UstKategori_Adi: string;
  subcategories?: Category[];
}

export interface Category {
  _id: string;
  Kategori_Adi: string;
  UstKategori_id: string;
}
