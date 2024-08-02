import { AuthService } from '../../services/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../../user/register/register.component';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Product } from '../../services/product.service';
import { MatBadgeModule } from '@angular/material/badge';
import { AdminItem, ContentService, UserItem } from '../../services/content.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatMenuModule,
    CommonModule,
    MatBadgeModule
  ],
})
export class NavbarComponent implements OnInit {
  navigationItems: AdminItem[] | UserItem[] = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  cartItems: any[] = [];
  showCart = false;
  cartItemCount = 0;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private cartService: CartService,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(
      (status: boolean) => {
        this.isLoggedIn = status;
        this.updateNavigationItems();
      }
    );

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateNavigationItems();
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

    this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
      this.updateNavigationItems();
    });
  }
  updateNavigationItems(): void {
    if (this.isAdmin) {
      this.navigationItems = this.contentService.AdminItems;
    } else if (this.isLoggedIn && !this.isAdmin) {
      this.navigationItems = this.contentService.UserItems;
    } else {
      this.navigationItems = this.contentService.GuestItems;
    }
  }

  selectItem(path: string): void {
    if (path === '/login') {
      this.openLoginDialog();
    } else if (path === '/register') {
      this.openRegisterDialog();
    } else {
      this.router.navigate([path]);
    }
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
    this.updateNavigationItems();
  }
}
