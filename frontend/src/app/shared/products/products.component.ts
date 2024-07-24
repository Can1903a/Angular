import { CategoryselectionComponent } from '../categoryselection/categoryselection.component';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatCard, MatCardContent, MatCardHeader, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SnackbarService } from '../../services/snackbar.service';
import { MatDialog } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ProductEditDialogComponent } from '../../admin/product-edit-dialog/product-edit-dialog.component';
import { MESSAGES } from '../../constants';


@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    imports: [MatPaginator, MatCard, MatToolbar, MatCardHeader, MatCardHeader, MatCardContent, MatCardActions, MatCardTitle, CurrencyPipe, NgFor,NgIf, MatButton, MatIcon, CategoryselectionComponent,MatInputModule]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalProducts: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  selectedCategoryId?: string;
  isAdmin: boolean = false;


  constructor(private router: Router,
    private productService: ProductService,
    private route: ActivatedRoute,
     private cartService: CartService,
    private snackbarService: SnackbarService,
     private authService: AuthService,
     private dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['subCategoryId'];
      this.loadProducts();
    });
    this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  addToCart(product: Product) {
    this.authService.isLoggedIn.subscribe(loggedIn => {
      if (loggedIn) {
        this.cartService.addToCart(product);
        this.snackbarService.openProductAdded;
      } else {
        this.snackbarService.openPorductFail;
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

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '400px',
      data: { product: {}, isEditMode: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.addProduct(this.products).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }


  editProduct(product: Product): void {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '400px',
      data: { product, isEditMode: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product._id, result).subscribe(() => {
          this.loadProducts();
        });
      }
    });
  }

  deleteProduct(productId: string): void {
    this.productService.deleteProduct(productId).subscribe(() => {
      this.loadProducts();
    });
  }

  isLoggedIn():void{
    this.authService.isLoggedIn
  }
}
