import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { SwiperOptions } from 'swiper/types';
import { CommonModule, NgFor, NgForOf } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  imports: [CommonModule, NgFor,NgForOf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss'
})
export class SliderComponent {
  products: Product[] = [];
  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: true,
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    autoplay: {
      delay: 2500,
      disableOnInteraction: false
    },
    loop: true
  };
  randomProducts: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getSliderProduct().subscribe(
      (products) => {
        this.randomProducts = products;
      },
      (error) => {
        console.error('Failed to fetch random products', error);
      }
    );
}
}
