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
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'login', component: LoginComponent, canActivate:[DialogGuard] },
      { path: 'register', component: RegisterComponent, canActivate:[DialogGuard] },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [ProfileGuard],
        children: [
          { path: 'profile', component: ProfileComponent }
        ]
      },
      {
        path: 'admin',
        canActivate: [RoleGuard],
        children: [
          { path: 'home', component: HomeComponent },
          { path: 'products', component: ProductsComponent },
          { path: 'users', component: UserListComponent }
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
