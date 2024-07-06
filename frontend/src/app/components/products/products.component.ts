import { Component, Input, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import { MatCard, MatCardContent, MatCardHeader, MatCardActions, MatCardTitle } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { CurrencyPipe, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-products',
    standalone: true,
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    imports: [MatPaginator, MatCard, MatToolbar, MatCardHeader, MatCardHeader, MatCardContent, MatCardActions, MatCardTitle, CurrencyPipe, NgFor, MatButton]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  totalProducts: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;
  selectedCategoryId?: number;

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategoryId = params['categoryId'];
      this.loadProducts();
    });
  }

  loadProducts(): void {
    if (this.selectedCategoryId) {
      this.productService.getProductsByCategory(this.selectedCategoryId).subscribe(products => {
        this.products = products;
      });
    } else {
      this.productService.getProducts(this.currentPage + 1, this.pageSize).subscribe(response => {
        this.products = response.data;
        this.totalProducts = response.total;
      });
    }
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.loadProducts();
  }
}
