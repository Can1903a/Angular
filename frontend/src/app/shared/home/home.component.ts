import { Component } from '@angular/core';
import { SliderComponent } from '../slider/slider.component';
import { RandomProductsComponent } from "../random-products/random-products.component";

@Component({
  selector: 'app-home',
  template: `<app-slider></app-slider> <app-random-products></app-random-products>`,
  standalone: true,
  imports: [SliderComponent, RandomProductsComponent],
  styles: []
})
export class HomeComponent { }
