import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { ProductsComponent } from '../products/products.component';
import { CategoryselectionComponent } from "../categoryselection/categoryselection.component";


@Component({
    selector: 'app-home',
    standalone: true,
    template: '<app-navbar></app-navbar><app-categoryselection></app-categoryselection><router-outlet></router-outlet>',
    styleUrl: './home.component.css',
    imports: [NavbarComponent, RouterOutlet, ProductsComponent, CategoryselectionComponent]
})
export class HomeComponent implements OnInit{


  constructor() { }

  ngOnInit(): void { }

}
