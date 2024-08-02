import { Product, ProductService } from './../../services/product.service';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { error } from 'console';

@Component({
  selector: 'app-random-products',
  standalone: true,
  imports: [NgFor,NgIf,MatCardContent,MatCardTitle,MatCard,CurrencyPipe],
  templateUrl: './random-products.component.html',
  styleUrl: './random-products.component.scss'
})
export class RandomProductsComponent implements OnInit{
  randomProducts: Product[] = [];

constructor(private productsService: ProductService){}

ngOnInit(): void {
  this.loadRandomProducts();

}

loadRandomProducts(): void{

  this.productsService.getRandomProducts().subscribe(
    (products: Product[]) => {
      this.randomProducts=products;
    },
    error =>{
      console.error('Random products not working:',error)
    }
  )
}
onProductClick(productId:string):void{
  this.productsService.onProductClick(productId)
}
}
