import { AuthService } from './../../services/auth.service';
import { Component,OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';
import { MatBadgeModule } from '@angular/material/badge';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, MatFormFieldModule, MatMenuModule,CommonModule,MatBadgeModule],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  cartItems: any[] = [];
  showCart = false;
  cartItemCount = 0;



  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private cartService: CartService
  ) {
  }



  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (status: boolean) => {
        this.isLoggedIn = status;
      }
    );


    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/register') {
          this.openRegisterDialog();
        } else if (event.url === '/login') {
          this.openLoginDialog();
        }
      }
    });

    this.cartService.cartItems$.subscribe((items: Product[]) => {
      this.cartItems = items;
      this.cartItemCount = items.reduce((count, item) => count + item.adet, 0);

    });
  }

  toggleCart() {
    this.showCart = !this.showCart;
  }

  removeFromCart(productId: string) {
    this.cartService.removeFromCart(productId);
  }

  openLoginDialog(): void {
    this.dialog.open(LoginComponent);
  }


  openRegisterDialog(): void {
    this.dialog.open(RegisterComponent);
  }


  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
  }


  loadProducts(){
    this.router.navigate(['home/products']);
  }

  loadHome(){
    this.router.navigate(['/home']);
  }

  openAccountComponent(){
    this.router.navigate(['home/account'])
  }

}
