import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
EnvironmentService

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient, private envService: EnvironmentService) {
    this.productsUrl = this.envService.getProductsUrl();
    this.apiUrl = this.envService.getApiUrl();
  }

  getProducts(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.productsUrl}?page=${page}&pageSize=${pageSize}`);
  }
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.envService.getProductsByCategoryUrl(categoryId));
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, product);
  }

  updateProduct(productId: string, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${productId}`, product);
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${productId}`);
  }
}

/*
export enum ProductNames {
  Urunler_id = 'Urunler_id',
  Urunler_Adi = 'Urunler_Adi',
  Urunler_Aciklama = 'Urunler_Aciklama',
  Urunler_Fiyat = 'Urunler_Fiyat',
  Stok_Adet = 'Stok_Adet',
  Kategori_id = 'Kategori_id',
  Resim_URL = 'Resim_URL',
  IndirimOrani = 'IndirimOrani',
  Marka_id = 'Marka_id',
}
*/
export interface Product {
  //  type: ProductNames;
  _id: string;
  Urunler_Adi: string;
  Urunler_Aciklama?: string;
  Urunler_Fiyat: number;
  Stok_Adet?: number;
  Kategori_id: string;
  Resim_URL?: string;
  IndirimOrani: number;
  Marka_id?: number;
  adet: number;
}
export interface ProductResponse {
  data: Product[];
  total: number;
}
