import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

   getApiUrl(): string {
    return environment.apiUrl;
  }

  getProductsUrl(): string {
    return environment.productsUrl;
  }

  getLoginUrl(): string {
    return environment.loginUrl;
  }

  getRegisterUrl(): string {
    return environment.registerUrl;
  }

  getCategoriesUrl(): string {
    return `${environment.apiUrl}/categories`;
  }

  getUpperCategoriesUrl(): string {
    return `${environment.apiUrl}/uppercategories`;
  }

  getSubcategoriesUrl(ustKategoriId: string): string {
    return `${environment.apiUrl}/subcategories/${ustKategoriId}`;
  }

  getProductsByCategoryUrl(categoryId: string): string {
    return `${environment.apiUrl}/products/${categoryId}`;
  }
  getProfileUrl():string{
    return environment.profileUrl;
  }
  getChangePasswordUrl(): string {
    return `${environment.apiUrl}/profile/change-password`;
  }
}
