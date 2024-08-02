import { CartService } from './cart.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';
import { Router } from '@angular/router';
EnvironmentService

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl: string;
  private apiUrl: string;
  private adminUrl : string;

  constructor(private http: HttpClient, private envService: EnvironmentService,
  private authService: AuthService,private CartService:CartService,
  private snackBarService:SnackbarService,private router: Router) {
    this.productsUrl = this.envService.getProductsUrl();
    this.apiUrl = this.envService.getApiUrl();
    this.adminUrl = this.envService.getAdminUrl();
  }

  getProducts(page: number, pageSize: number): Observable<any> {
    return this.http.get<any>(`${this.productsUrl}?page=${page}&pageSize=${pageSize}`);
  }
  getProductsByCategory(categoryId: string): Observable<Product[]> {
    return this.http.get<Product[]>(this.envService.getProductsByCategoryUrl(categoryId));
  }

  getAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.adminUrl}/products`);
  }

  getAdminProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.adminUrl}/products/${productId}`);
  }

  addProduct(product: Product[]): Observable<Product[]> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.post<Product[]>(`${this.adminUrl}/products`, product ,{headers});
  }

  updateProduct(productId: string, product: Product[]): Observable<Product[]> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.put<Product[]>(`${this.adminUrl}/products/${productId}`, product, { headers });
  }

  deleteProduct(productId: string): Observable<Product[]> {
    const headers = this.authService.addTokenToHeaders();
    return this.http.delete<Product[]>(`${this.adminUrl}/products/${productId}`, { headers });

  }

  getSliderProduct(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/slider`)
  }

  getRandomProducts(): Observable<Product[]>{
    return this.http.get<Product[]>(`${this.apiUrl}/randomProducts`)
  }

  getProductbyProductId(productId: string):Observable<Product>{
    return this.http.get<Product>(`${this.apiUrl}/product/${productId}`);
  }

  addToCart(product: Product) {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      if (loggedIn) {
        this.CartService.addToCart(product);
        this.snackBarService.openProductAdded;
      } else {
        this.snackBarService.openPorductFail;
      }
    });
  }
  onProductClick(productId: string): void {
    this.router.navigate(['/products', productId]);
  }
}

export interface Product {
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
