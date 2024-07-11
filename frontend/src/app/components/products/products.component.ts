import { CategoryselectionComponent } from './../categoryselection/categoryselection.component';
import { AuthService } from './../../services/auth.service';
import { CartService } from './../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatCard, MatCardContent, MatCardHeader, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { CurrencyPipe, NgFor } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';
@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    imports: [MatPaginator, MatCard, MatToolbar, MatCardHeader, MatCardHeader, MatCardContent, MatCardActions, MatCardTitle, CurrencyPipe, NgFor, MatButton, MatIcon, CategoryselectionComponent]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalProducts: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  selectedCategoryId?: string;

  constructor(private router: Router,private productService: ProductService, private route: ActivatedRoute, private cartService: CartService,private snackbarService: SnackbarService, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['subCategoryId'];
      this.loadProducts();
    });
  }

  addToCart(product: Product) {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      if (loggedIn) {
        this.cartService.addToCart(product);
        this.snackbarService.openSnackBar('Product added to cart!', 3000);
      } else {
        this.router.navigate(['/login']);//??????????????
      }
    });
  }

  loadProducts(): void {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(
        (products: Product[]) => {
          this.products = products;
        },
        error => {
          console.error('Error fetching products by category:', error);
        }
      );
    } else {
      this.productService.getProducts(this.currentPage + 1, this.pageSize).subscribe(
        (response: any) => {
          this.products = response.data;
          this.totalProducts = response.total;
        },
        error => {
          console.error('Error fetching products:', error);
        }
      );
    }
  }


  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadProducts();
  }
}
