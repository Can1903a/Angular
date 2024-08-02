import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { CommentSectionComponent } from "../comment-section/comment-section.component";

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [NgIf, CurrencyPipe, MatButton, MatCard, MatCardTitle, CommentSectionComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('productId');
    if (productId) {
      this.productService.getProductbyProductId(productId).subscribe(
        (product: Product) => {
          this.product = product;
        },
        (error) => {
          console.error('Error fetching product details:', error);
        }
      );
    }
  }
  addToCart():void{
    if (this.product) {
      this.productService.addToCart(this.product);
    }
  }

}

