import { RouterModule, Routes} from '@angular/router';
import { NgModule } from '@angular/core';
import { RoleGuard } from './role.guard';
import { LayoutComponent } from './layout/layout.component';
import { ProductsComponent } from './shared/products/products.component';
import { LoginComponent } from './shared/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { DialogGuard } from './dialog.guard';
import { AccountComponent } from './user/account/account.component';
import { ProfileGuard } from './profile.guard';
import { ProfileComponent } from './user/profile/profile.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { HomeComponent } from './shared/home/home.component';
import { ProductDetailsComponent } from './user/product-details/product-details.component';
import { BasketComponent } from './user/basket/basket.component';
import { CommentManagementComponent } from './admin/comment-management/comment-management.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent, title:'Home'},
      { path: 'products', component: ProductsComponent, title:'Products' },
      { path: 'products/:productId', component: ProductDetailsComponent},
      { path: 'login', component: LoginComponent, canActivate:[DialogGuard], title:'Login' },
      { path: 'register', component: RegisterComponent, canActivate:[DialogGuard], title:'Register' },
      { path: 'basket', component: BasketComponent, title:'Basket' },
      {
        path: 'account',
        component: AccountComponent,
        title:'Account',
        canActivate: [ProfileGuard],
        children: [
          { path: 'profile', component: ProfileComponent, title: 'Profile' }
        ]
      },
      {
        path: 'admin',
        canActivate: [RoleGuard],
        children: [
          { path: 'home', component: HomeComponent },
          { path: 'products', component: ProductsComponent , title:'Products' },
          { path: 'users', component: UserListComponent, title:'Users'  },
          { path: 'comments', component:CommentManagementComponent, title:'Comments'}
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RoutesModule { }
